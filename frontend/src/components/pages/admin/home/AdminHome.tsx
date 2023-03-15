import MenuList from "./MenuList";

export default function AdminHome() {
    return (
        <div id="page-admin-home">
            <div className="row">
                <div className="col-12">
                    <h1>Administration</h1>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <MenuList />
                </div>
            </div>
        </div>
    );
}
