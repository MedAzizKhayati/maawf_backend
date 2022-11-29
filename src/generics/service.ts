import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { GenericEntity } from './entity';


// A generic service for all the services to extend from
export abstract class GenericsService<Entity extends GenericEntity, CDto extends DeepPartial<Entity>, UDto extends DeepPartial<Entity>> {
    constructor(protected readonly repository: Repository<Entity>) { }

    // Create a new entity
    async create(createDto: CDto) {
        const entity = this.repository.create(createDto);
        return this.repository.save(entity);
    }

    // Find all entities
    async findAll() {
        return this.repository.find();
    }

    // Find one entity by id
    async findOne(id: string) {
        return this.repository.findOneBy({ id } as FindOptionsWhere<Entity>);
    }

    // Update an entity
    async update(id: string, updateDto: UDto) {
        return this.repository.update(id, updateDto as any);
    }

    // Delete an entity
    async remove(id: string) {
        return this.repository.delete(id);
    }

}

