import React from "react";
import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";

const FastestLaps = () => {
    return (
        <div id="page-admin-fastest-laps">
            <div className="row">
                <div className="col-12">
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb label="Tours les plus rapides" />
                    </Breadcrumbs>
                </div>
            </div>
        </div>
    )
}

export default FastestLaps;
