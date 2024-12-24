import Toastr from "toastr2";

class ToastService {
  private static instance: ToastService | null = null;

  private readonly toastr: Toastr;

  private constructor() {
    this.toastr = new Toastr();
  }

  public static getToastr(): Toastr {
    return ToastService.getInstance().toastr;
  }

  private static getInstance(): ToastService {
    if (ToastService.instance === null) {
      ToastService.instance = new ToastService();
    }

    return ToastService.instance;
  }
}

export default ToastService;
