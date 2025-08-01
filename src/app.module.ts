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
import { TotalAmountSchema } from './schema/totalAmount.schema';
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
import { ImagesService } from './service/product-listing-images/product-listing-images.service';
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
import { ReferralAmountSchema } from './schema/referralAmount.Schema';
import { LikesController } from './controller/likes/likes.controller';
import { LikesService } from './service/categoryService/likes/likes.service';
import { LikesSchema } from './schema/likes.schema';
import { userVehicleService } from './service/userVehicles/user-vehicles.service';
import { userVehiclesController } from './controller/userVehicles/user-vehicles.controller';
import { UserVehiclesSchema } from './schema/userVehicle.schema';
import { referralsController } from './controller/referrals/referrals.controller';
import { ReferralsService } from './service/referrals/referrals.service';
import { ReferralsSchema } from './schema/referrals.Schema';
import { RentalController } from './controller/rental/rental.controller';
import { RentalService } from './service/rental/rental.service';
import { RentalCategoryController } from './controller/rental-category/rental-category.controller';
import { RentalCategoryService } from './service/rental-category/rental-category.service';
import { RentalBookingsService } from './service/rental-bookings/rental-bookings.service';
import { rentalCategorySchema } from './schema/rentalCategory.Schema';
import { UnitMeasurementController } from './controller/unit-measurement/unit-measurement.controller';
import { RentalBookingsController } from './controller/rental-bookings/rental-bookings.controller';
import { unitMeasurementSchema } from './schema/unitMeasurement.schema';
import { rentalImagesSchema } from './schema/rentalImage.schema';
import { TransactionsController } from './controller/transactions/transactions.controller';
import { TransactionSchema } from './schema/transaction.schema';
import { TransactionsService } from './service/transactions/transactions.service';
import { FramerProfileController } from './framer-profile/framer-profile.controller';
import { FarmerProfileSchema } from './schema/farmerProfile.schema';
import { paymentTypeSchema } from './schema/paymentMode.schema';
import { PaymentSchema } from './schema/payment.schema';
import { OwnerReminderSchema } from './schema/ownerReminder.schema';
import { PrivacyPolicySchema } from './schema/privacyPolicy.schema';
import { DiarySchema } from './schema/diary.schema';
import { Driver, DriverSchema } from './schema/driver.schema';
import { AblyServiceMaps } from './utils/ablyServiceMaps';
import { DriverLocationSchema } from './schema/driverLocation.schema';
import { LocationTrackingSchema } from './schema/locationTrackingSchema';
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
      { name: 'Diary', schema: DiarySchema },
      { name: 'rentalCategory', schema: rentalCategorySchema },
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
      { name: 'Likes', schema: LikesSchema },
      { name: 'UserVehicles', schema: UserVehiclesSchema },
      { name: 'Referrals', schema: ReferralsSchema },
      { name: 'unitMeasurement', schema: unitMeasurementSchema },
      { name: 'ReferralAmount', schema: ReferralAmountSchema },
      { name: 'RentalImages', schema: rentalImagesSchema },
      { name: 'Transactions', schema: TransactionSchema },
      { name: 'FarmerProfile', schema: FarmerProfileSchema },
      { name: 'paymentType', schema: paymentTypeSchema },
      { name: 'totalAmount', schema: TotalAmountSchema },
      { name: 'Payment', schema: PaymentSchema },
      { name: 'OwnerReminder', schema: OwnerReminderSchema },
      { name: 'PrivacyPolicy', schema: PrivacyPolicySchema },
      { name: 'Driver', schema: DriverSchema },
      { name: 'DriverLocation', schema: DriverLocationSchema },
      { name: 'LocationTracking', schema: LocationTrackingSchema },
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
    LikesController,
    userVehiclesController,
    referralsController,
    RentalController,
    RentalCategoryController,
    RentalBookingsController,
    UnitMeasurementController,
    TransactionsController,
    FramerProfileController,
  ],
  providers: [
    AppService,
    UserService,
    AblyServiceMaps,
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
    ImagesService,
    ConversationsService,
    MessagesService,
    SocketService,
    AdsService,
    LikesService,
    userVehicleService,
    ReferralsService,
    RentalService,
    RentalCategoryService,
    RentalBookingsService,
    TransactionsService,
  ],
})
export class AppModule {}
