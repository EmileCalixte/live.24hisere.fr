import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";

const Races = () => {
    return (
        <div id="page-admin-runners">
            <div className="row">
                <div className="col-12">
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb label="Courses" />
                    </Breadcrumbs>
                </div>
            </div>
        </div>
    )
}

export default Races;
