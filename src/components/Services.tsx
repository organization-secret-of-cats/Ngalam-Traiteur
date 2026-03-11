import styles from "./Services.module.css";

import ICON_BUFFET from "../icons/buffet.png";
import ICON_DELIVERY from "../icons/delivery.png";
import ICON_EVENT from "../icons/event.png";
import ICON_MARIAGE from "../icons/mariage.png";
import ICON_SERVICE from "../icons/service.png";

const services = [
  { label: "Buffet", icon: ICON_BUFFET },
  { label: "Service traiteur", icon: ICON_SERVICE },
  { label: "Livraison", icon: ICON_DELIVERY },
  { label: "Événements", icon: ICON_EVENT },
  { label: "Mariage", icon: ICON_MARIAGE },
];

export default function Services() {
    return (
        <div className={styles.wrapper}>
            {services.map((service) => {
                return (
                    <div key={service.label} className={styles.item}>
                        <div className={styles.circle}>
                            <img src={service.icon.src} alt={service.label} className={styles.icon} />
                        </div>
                        <span className={styles.label}>{service.label}</span>
                    </div>
                );
            })}
        </div>
    )
}