import Toastr from "toastr2";

class ToastUtil {
    static toastr = null;

    /**
     * @return {Toastr}
     */
    static getToastr = () => {
        if (ToastUtil.toastr === null) {
            ToastUtil.toastr = new Toastr();
        }

        return this.toastr;
    }
}

export default ToastUtil;
