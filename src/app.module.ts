import { Module, Scope } from '@nestjs/common';
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
import { ModelsController } from './controller/models/models.controller';
import { ModelsService } from './service/models/models.service';
import { ProductSchema } from './schema/product.schema';
import { ModelSchema } from './schema/model.schema';
import { AppVersionController } from './controller/app-version/app-version.controller';
import { AppVersionService } from './service/appVersion/app-version.service';
import { AppVersionSchema } from './schema/appVersion.schema';
import { SocialContentController } from './controller/social-content/social-content.controller';
import { SocialContentService } from './service/social-content/social-content.service';
import { SocialContentSchema } from './schema/socialContent.schema';
import { WebsocketsGateway } from './utils/chat.gateway';
import { ProductImagesSchema } from './schema/productListingImagesSchema';
import { ProductListingImagesController } from './controller/product-listing-images/product-listing-images.controller';
import { ProductListingImagesService } from './service/product-listing-images/product-listing-images.service';
import { ConversationsController } from './controller/conversations/conversations.controller';
import { ConversationsService } from './service/conversations/conversations.service';
import { ConversationSchema } from './schema/conversation.schema';
import { MessageSchema } from './schema/messages.schema';
import { MessagesService } from './service/messages/messages.service';
import { SocketService } from './service/socket/socket.service';
import { adsSchema } from './schema/ads.schema';
import { AdsController } from './controller/ads/ads.controller';
import { AdsService } from './service/ads/ads.service';
import { AuthInterceptor } from './Interceptors/authentication.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
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
      { name: 'Model', schema: ModelSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Socialcontent', schema: SocialContentSchema },
      { name: 'appVersion', schema: AppVersionSchema },
      { name: 'ProductImages', schema: ProductImagesSchema },
      { name: 'Conversation', schema: ConversationSchema },
      { name: 'Message', schema: MessageSchema },
      { name: 'Ads', schema: adsSchema },
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
    ModelsController,
    AppVersionController,
    SocialContentController,
    ProductListingImagesController,
    ConversationsController,
    AdsController,
  ],
  providers: [
    AppService,
    UserService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   scope: Scope.REQUEST,
    //   useClass: AuthInterceptor,
    // },
    AuthInterceptor,
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
    ModelsService,
    AppVersionService,
    SocialContentService,
    WebsocketsGateway,
    ProductListingImagesService,
    ConversationsService,
    MessagesService,
    SocketService,
    AdsService,
  ],
})
export class AppModule {}
