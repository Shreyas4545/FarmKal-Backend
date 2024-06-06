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
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { OtpService } from './service/otp/otp.service';
import { OtpController } from './controller/otp/otp.controller';
import { OtpSchema } from './schema/otp.schema';
// import { SmsService } from './service/sms/sms.service';
import { JwtGenerate } from './utils/jwt.token';
import { CategorySchema } from './schema/category.shema';
import { BrandsService } from './service/brands/brands.service';
import { BrandsController } from './controller/brands/brands.controller';
import { ProductController } from './controller/product/product.controller';
import { ProductService } from './service/product/product.service';
import { BrandSchema } from './schema/brand.schema';
import { FirebaseService } from './utils/imageUpload';
import { LocationService } from './service/locations/locations.service';
import { LocationsController } from './controller/locations/locations.controller';
import { LocationSchema } from './schema/location.schema';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      dbName: 'farmkalDB',
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'OTP', schema: OtpSchema },
      { name: 'Brand', schema: BrandSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'Location', schema: LocationSchema },
    ]),
  ],
  controllers: [
    AppController,
    UserController,
    CategoryController,
    OtpController,
    BrandsController,
    ProductController,
    LocationsController,
  ],
  providers: [
    AppService,
    UserService,
    CategoryService,
    ResponseCompo,
    JwtService,
    OtpService,
    JwtGenerate,
    // SmsService,
    BrandsService,
    FirebaseService,
    ProductService,
    LocationService,
  ],
})
export class AppModule {}
