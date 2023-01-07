import React from "react";
import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";

const CreateRunner = () => {
    return (
        <div id="page-admin-create-runner">
            <div className="row">
                <div className="col-12">
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb url="/admin/runners" label="Coureurs" />
                        <Crumb label="Créer un coureur" />
                    </Breadcrumbs>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-4 col-lg-6 col-md-9 col-12">
                    <h2>Créer un coureur</h2>
                </div>
            </div>
        </div>
    )
}

export default CreateRunner;
