import {
  Controller,
  Post,
  Get,
  Put,
  Res,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ModelsService } from '../../service/models/models.service';
import { createModelDTO } from '../../dto/modelDto/create-model.dto';
import { updateModelDTO } from '../../dto/modelDto/update-model.to';
import { ResponseCompo } from '../../utils/response';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../../utils/imageUpload';

@Controller('api/model')
export class ModelsController {
  constructor(
    private readonly modelService: ModelsService,
    private readonly responseCompo: ResponseCompo,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async createModel(
    @Res() response,
    @Body() data: createModelDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const fileUrl: string = await this.firebaseService.uploadFile(file);
      let newModel: any = { ...data, image: fileUrl };
      newModel = await this.modelService.createModel(newModel);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Created Model',
        },
        newModel,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getModels')
  async get(@Res() response, @Query('id') id: string, @Body() data: any) {
    try {
      const models: any = await this.modelService.getModel(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Sent Models',
        },
        models,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Put('/updateModels/:id')
  async updateModel(
    @Res() response,
    @Param('id') id: string,
    @Body() data: updateModelDTO,
  ) {
    try {
      const updatedModel = await this.modelService.updateModel(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Updated Model',
        },
        updatedModel,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }
}
