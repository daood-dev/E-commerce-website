import { ProductRepository } from '../../data/repositories/ProductRepository';

export class InventoryCheckFilter {
  static get filterName() {
    return "2. Inventory Check Filter";
  }

  async process(context) {
    context.logStep(InventoryCheckFilter.filterName, "running", "Querying ProductRepository to verify real-time stock levels...");
    await new Promise(resolve => setTimeout(resolve, 500));

    const productRepo = new ProductRepository();
    const checkedItems = [];

    for (const item of context.items) {
      const product = productRepo.getById(item.product_id);
      if (!product) {
        context.abort(InventoryCheckFilter.filterName, `Inventory Check Failed: Item '${item.product_name || item.product_id}' no longer exists in catalog.`);
        return false;
      }

      if (product.stock_quantity < item.quantity) {
        context.abort(
          InventoryCheckFilter.filterName, 
          `Stock Depleted: Insufficient inventory for '${product.name}'. Required: ${item.quantity}, In Stock: ${product.stock_quantity}`
        );
        return false;
      }

      checkedItems.push({
        product_id: product.product_id,
        name: product.name,
        available: product.stock_quantity,
        requested: item.quantity
      });
    }

    context.logStep(
      InventoryCheckFilter.filterName, 
      "passed", 
      `All ${context.items.length} items verified in stock and reserved for checkout.`,
      { checkedItems }
    );
    return true;
  }
}
