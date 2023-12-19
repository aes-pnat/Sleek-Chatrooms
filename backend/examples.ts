// -----------

class InjectableService {
  constructor(protected _injectionContext: InjectionContext) {}
}

class ServiceA extends InjectableService {
  public doSomething() {}
}
class ServiceB extends InjectableService {
  public doAThing() {
    this._injectionContext.A.doSomething();
  }
}
class ServiceC extends InjectableService {}

export class InjectionContext {
  private _a!: ServiceA;
  public get A(): ServiceA {
    return this._a || (this._a = new ServiceA(this));
  }

  private _b!: ServiceB;
  public get B(): ServiceB {
    return this._b || (this._b = new ServiceB(this));
  }

  private _c!: ServiceC;
  public get C(): ServiceC {
    return this._c || (this._c = new ServiceC(this));
  }
}

// -----------
