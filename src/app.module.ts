import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentController } from './controller/student/student.controller';
import { StudentSchema } from './schema/student.schema';
import { UserSchema } from './schema/user.schema';
import { StudentService } from './service/student/student.service';
import { UserController } from './controller/userController/user.controller';
import { UserService } from './service/userService/user.service';
import { CategoryController } from './controller/categoryController/category.controller';
import { CategoryService } from './service/categoryService/category.service';
import { ResponseCompo } from './utils/response';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://farmkalDB:farmkaldb123@cluster0.md9tqb0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      {
        dbName: 'farmkalDB',
      },
    ),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AppController, UserController, CategoryController],
  providers: [AppService, UserService, CategoryService, ResponseCompo],
})
export class AppModule {}
