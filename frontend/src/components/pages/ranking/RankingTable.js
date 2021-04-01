import React from "react";
import RankingTableRow from "./RankingTableRow";

class RankingTable extends React.Component {
    render = () => {
        // TODO get ranking from parent component, add row props (global ranking, ranking per category, per gender...)

        return(
            <table id="ranking-table" className="table">
                <thead>
                <tr>
                    <th>Rang</th><th>Doss.</th><th>H/F</th><th>Cat.</th><th>Nom</th><th>Tours</th><th>Dist.</th><th>Dernier passage</th><th>V. moy.</th><th>Détails</th>
                </tr>
                </thead>
                <tbody>
                <RankingTableRow
                    displayedRanking={1}
                    id={72}
                    gender='h'
                    category='v3'
                    firstname='John'
                    lastname='Doe'
                    lapCount={142}
                    distance={145842}
                    distanceMetric='km'
                    lastPassageTime='17:14:52'
                    averageSpeed={7.3}
                    averageSpeedMetric='km/h'
                />
                <RankingTableRow
                    displayedRanking={2}
                    id={14}
                    gender='f'
                    category='SE'
                    firstname='Mireille'
                    lastname='Plantetout'
                    lapCount={139}
                    distance={141307}
                    distanceMetric='km'
                    lastPassageTime='17:11:07'
                    averageSpeed={7.21}
                    averageSpeedMetric='km/h'
                />
                </tbody>
            </table>
        )
    }
}

export default RankingTable;
