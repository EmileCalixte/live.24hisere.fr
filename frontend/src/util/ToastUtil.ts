import Toastr from "toastr2";

class ToastUtil {
    static toastr: Toastr | null = null;

    static getToastr = (): Toastr => {
        if (ToastUtil.toastr === null) {
            ToastUtil.toastr = new Toastr();
        }

        return ToastUtil.toastr;
    };
}

export default ToastUtil;
