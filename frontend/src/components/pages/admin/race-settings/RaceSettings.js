import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";

const RaceSettings = () => {
    return (
        <div id="page-admin-race-settings">
            <div className="row">
                <div className="col-12">
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb label="Paramètres de course" />
                    </Breadcrumbs>
                </div>
            </div>
        </div>
    )
}

export default RaceSettings;
