import "./drug-card.css";
import drugImg from "../../../assets/images/drugs.svg";
import apiImg from "../../../assets/images/Api Manufacturers.svg";
import clinicalImg from "../../../assets/images/Clinical Trials.svg";

interface Drug {
    title: string;
    regions: string;
    count: number;
}

interface DrugCardProps {
    drug: Drug;
}

const DrugCard: React.FC<DrugCardProps> = ({ drug }) => {
    let imgPath: any;
    if (drug?.title == 'Drugs') {
        imgPath = drugImg
    } else if (drug?.title == 'API Manufacturers') {
        imgPath = apiImg
    } else {
        imgPath = clinicalImg
    }
    return (
        <div className="drugs-US">
            <div className="icon-grup">
                <img className="drug-icon" alt="Drug icon" src={imgPath} />
            </div>
            <div className="drugs-count">
                <div className="group">
                    <div className="text-wrapper">{drug?.title}</div>
                    <div className="div">{drug?.regions}</div>
                </div>
                <div className="text-wrapper-2">{drug?.count}</div>
            </div>
        </div>

    );
}

export default DrugCard;