import addPaginationToOptions from '@/utils/addPaginationToOptions';
import { DeepPartial, FindOptionsOrder, FindOptionsWhere, MoreThan, Repository } from 'typeorm';
import { GenericEntity } from './entity';


export type FindAllOptions = {
    page?: number;
    after?: DeepPartial<any> | string;
    take?: number;
    where?: FindOptionsWhere<any>;
}

const DEFAULT_FIND_ALL_OPTIONS: FindAllOptions = {
    page: 1,
    take: 10
}

// A generic service for all the services to extend from
export abstract class GenericsService<Entity extends GenericEntity, CDto extends DeepPartial<Entity>, UDto extends DeepPartial<Entity>> {
    constructor(protected readonly repository: Repository<Entity>) { }

    // Create a new entity
    async create(createDto: CDto) {
        const entity = this.repository.create(createDto);
        return this.repository.save(entity);
    }

    // Find all entities with pagination (after an ID)
    async findAll(options = DEFAULT_FIND_ALL_OPTIONS) {
        let { page, take, after, where } = { ...DEFAULT_FIND_ALL_OPTIONS, ...options };
        after = after ? (typeof after === 'string' ? after : after.id) : null;

        where = (after ? { id: MoreThan(after), ...where } : {}) as FindOptionsWhere<Entity>;
        return this.repository.find(addPaginationToOptions({
            where,
            order: {
                id: 'ASC'
            } as FindOptionsOrder<Entity>
        }, page, take));
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
    async delete(id: string) {
        return this.repository.delete(id);
    }

}

