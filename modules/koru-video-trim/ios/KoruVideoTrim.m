#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE (KoruVideoTrim, NSObject)

RCT_EXTERN_METHOD(trim
                  : (NSString *)sourcePath startMs
                  : (nonnull NSNumber *)startMs endMs
                  : (nonnull NSNumber *)endMs resolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

@end
