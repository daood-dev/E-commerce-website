// Interface / Base Class for Repository Pattern
// Encapsulates data access and decouples persistence implementation from domain business logic

export class IRepository {
  getAll() {
    throw new Error("Repository method getAll() must be implemented");
  }

  getById(id) {
    throw new Error("Repository method getById(id) must be implemented");
  }

  create(entity) {
    throw new Error("Repository method create(entity) must be implemented");
  }

  update(id, entity) {
    throw new Error("Repository method update(id, entity) must be implemented");
  }

  delete(id) {
    throw new Error("Repository method delete(id) must be implemented");
  }
}
