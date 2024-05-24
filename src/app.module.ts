import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserSchema } from './schema/user.schema';
import { UserController } from './controller/userController/user.controller';
import { UserService } from './service/userService/user.service';
import { CategoryController } from './controller/categoryController/category.controller';
import { CategoryService } from './service/categoryService/category.service';
import { ResponseCompo } from './utils/response';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      dbName: 'farmkalDB',
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AppController, UserController, CategoryController],
  providers: [AppService, UserService, CategoryService, ResponseCompo],
})
export class AppModule {}
