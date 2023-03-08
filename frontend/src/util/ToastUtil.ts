import Toastr from "toastr2";

class ToastUtil {
    private static instance: ToastUtil | null = null;

    private readonly toastr: Toastr;

    private constructor() {
        this.toastr = new Toastr();
    }

    public static getToastr = (): Toastr => {
        return ToastUtil.getInstance().toastr;
    };

    private static getInstance(): ToastUtil {
        if (ToastUtil.instance === null) {
            ToastUtil.instance = new ToastUtil();
        }

        return ToastUtil.instance;
    }
}

export default ToastUtil;
