import { Console } from 'console';
// import { LoggerService } from './logger.service';

// import { LogFunctionCalls } from './logMethodCall.decorator';


export function applyLoggingDecorator(service: any,location): any {
  //   const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(service));
  //   keys.forEach((key) => {
  //     const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(service), key);
  //     if (descriptor && typeof descriptor.value === 'function') {
  //       descriptor.value = LogFunctionCalls()(Object.getPrototypeOf(service), key, descriptor);
  //     }
  //   });
//   return new Proxy(service, {
//     get(target: any, propertyKey: string | symbol, receiver: any) {
//       const originalMethod = target[propertyKey];
//       if (typeof originalMethod === 'function') {
//         return function (...args: any[]) {
//           const methodName = String(propertyKey);
//           let a= []
//           for(let arg of args){
//             if(typeof arg=="string"){
//               a.push(arg)
//             }
//           }
         
//           if(methodName!="getFrameStyle" && methodName!="getLocallData"){
//             const error = new Error();
//             // console.log(error.stack)
//             let obj = {
//               functionName: methodName,
//               value: a,
//               location:location,
//               date:new Date()
//             }
//             logDataa.push(obj)
//           }
//           try {
//             const result = originalMethod.apply(this, args);
//             if (result instanceof Promise) {
//               return result
//                 .then((res: any) => {
//                   logger.log(`Exiting ${methodName} with result: ${JSON.stringify(res)}`);
//                   return res;
//                 })
//                 .catch((err: any) => {
//                    logger.error(`Error in ${methodName}: ${err.message}`);
//                   throw err;
//                 });
//             } else {
//               logger.log(`Exiting ${methodName} with result: ${JSON.stringify(result)}`);
//               return result;
//             }
//           } catch (error) {
//             logger.error(`Error in ${methodName}: ${error.message}`);
//             throw error;
//           }
//         }
//       }
//       return originalMethod;
//     }
//   });
// }

return new Proxy(service, {
  get(target: any, propertyKey: string | symbol, receiver: any) {
    // console.log(receiver);
    const originalMethod = target[propertyKey];
    if (typeof originalMethod === 'function') {
      return function (...args: any[]) {
        const methodName = String(propertyKey);

        if( methodName!="app_add_para" && methodName!="get_current_record" && location != 'canvas-modal-service'){
          console.log(`From component ${location} Entering method ${methodName} with arguments: `,args);
        }
        
        let obj={
          functionName:methodName,
          value:args
        }
        logData.push(obj)

        // return;
        try {
          const result = originalMethod.apply(this, args);
          if (result instanceof Promise) {
            return result
              .then((res: any) => {
                if( methodName!="app_add_para" && methodName!="get_current_record"){
                // console.log(`From component ${location} Exiting method  ${methodName} with result: `,res);
                }
                return res;
              })
              .catch((err: any) => {
                console.log(`From component ${location} Error in ${methodName}: ${err.message}`);
                throw err;
              });
          } else {
            if( methodName!="app_add_para" && methodName!="get_current_record"){
              // console.log(` From component ${location} Exiting method ${methodName} with result: `,result);
              }
            return result;
          }
        } catch (error) {
          console.log(`From component ${location} Error in ${methodName}: ${error.message}`);
          throw error;
        }
      };
    }
    return originalMethod;
  }
});
}
export let logData:any=[]
export function LogFunctionCalls(location) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    // const logger = new LoggerService();
    descriptor.value = function (...args: any[]) {
    
      console.log("logTest")
      let obj = {
        functionName: propertyKey,
        value: args,
        location:location
      }
      logData.push(obj);
    
      const result = originalMethod.apply(this, args);
      // logger.logData(`Function ${propertyKey} returned: ${JSON.stringify(result)}`);
      return result;
    };

    return descriptor;
  };
}
export function clearlogdata(){
  logData=[]
  console.log(logData)
}