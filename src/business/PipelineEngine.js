import { OrderValidationFilter } from './filters/OrderValidationFilter';
import { InventoryCheckFilter } from './filters/InventoryCheckFilter';
import { PriceAndDiscountFilter } from './filters/PriceAndDiscountFilter';
import { PaymentProcessingFilter } from './filters/PaymentProcessingFilter';
import { OrderCreationFilter } from './filters/OrderCreationFilter';
import { ShippingProcessingFilter } from './filters/ShippingProcessingFilter';
import { NotificationFilter } from './filters/NotificationFilter';

export class PipelineEngine {
  constructor() {
    // Pipe-and-Filter registered filter chain
    this.filters = [
      new OrderValidationFilter(),
      new InventoryCheckFilter(),
      new PriceAndDiscountFilter(),
      new PaymentProcessingFilter(),
      new OrderCreationFilter(),
      new ShippingProcessingFilter(),
      new NotificationFilter()
    ];
  }

  async execute(pipelineContext, onStepChange = null) {
    for (let i = 0; i < this.filters.length; i++) {
      const filter = this.filters[i];
      const filterName = filter.constructor.filterName;

      if (onStepChange) {
        onStepChange({
          stepIndex: i,
          filterName,
          status: "running",
          log: pipelineContext.executionLog
        });
      }

      const success = await filter.process(pipelineContext);

      if (!success || pipelineContext.isAborted) {
        if (onStepChange) {
          onStepChange({
            stepIndex: i,
            filterName,
            status: "failed",
            reason: pipelineContext.abortReason,
            log: pipelineContext.executionLog
          });
        }
        return {
          success: false,
          error: pipelineContext.abortReason,
          context: pipelineContext
        };
      }

      if (onStepChange) {
        onStepChange({
          stepIndex: i,
          filterName,
          status: "passed",
          log: pipelineContext.executionLog
        });
      }
    }

    return {
      success: true,
      order: pipelineContext.orderRecord,
      context: pipelineContext
    };
  }
}
