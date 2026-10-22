import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DynamicFunctionService {
  private functions = new Map<string, Function>();

  // registerFunction(functionCode: string): string {
  //         functionCode = functionCode.replaceAll("oajs", "ajs");
  //          functionCode = functionCode.replaceAll("gajs", "ajs");
  //         // console.log(functionCode);
  //   const match = functionCode.match(
  //     /^\s*(async\s+)?function\s+([a-zA-Z_$][\w$]*)\s*\(/
  //   );

  //   if (!match) {
  //     throw new Error('Invalid function declaration');
  //   }

  //   const functionName = match[2];

  //   // Convert function source into a function object
  //   const fn = new Function(
  //     `return (${functionCode})`
  //   )() as Function;

  //   // Store it in the service, not on window
  //   this.functions.set(functionName, fn);

  //   return functionName;
  // }

  getFunction(functionName: string): Function | undefined {
    return this.functions.get(functionName);
  }

  async executeFunction(
    functionName: string,
    ...args: any[]
  ): Promise<any> {
    const fn = this.functions.get(functionName);

    if (!fn) {
      throw new Error(`Function not found: ${functionName}`);
    }

    return await fn(...args);
  }

  removeFunction(functionName: string): void {
    this.functions.delete(functionName);
  }

  clearFunctions(): void {
    this.functions.clear();
  }

    [key: string]: any;

  registerFunction(functionCode: string): string {
      // functionCode = functionCode.replaceAll("oajs", "ajs");
      //      functionCode = functionCode.replaceAll("gajs", "ajs");
    const match = functionCode.match(
      /^\s*(?:async\s+)?function\s+([a-zA-Z_$][\w$]*)\s*\(/
    );

    if (!match) {
      throw new Error('Invalid function declaration');
    }

    const functionName = match[1];

    // Only register trusted backend JavaScript.
    const fn = new Function(`return (${functionCode})`)();

    this[functionName] = fn;

    return functionName;
  }

}
