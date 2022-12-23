import { GenericsService } from "@/generics/service";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateReactDto } from "./dto/react.dto";
import { UpdateReactDto } from "./dto/update-react.dto";
import { React } from "./entities/react.entity";

@Injectable()
export class ReactService extends GenericsService<React, CreateReactDto, UpdateReactDto> {
  constructor(
    @InjectRepository(React) repo: Repository<React>
  ) {
    super(repo);
  }
}
