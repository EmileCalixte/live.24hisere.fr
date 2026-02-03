import Toastr from "toastr2";

class ToastService {
  private static instance: ToastService | null = null;

  // eslint-disable-next-line @typescript-eslint/no-unused-private-class-members
  private readonly toastr: Toastr;

  private constructor() {
    this.toastr = new Toastr();
  }

  public static getToastr(): Toastr {
    return ToastService.getInstance().toastr;
  }

  private static getInstance(): ToastService {
    ToastService.instance ??= new ToastService();

    return ToastService.instance;
  }
}

export default ToastService;
