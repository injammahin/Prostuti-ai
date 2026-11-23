import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLandmark,
  faBriefcase,
  faBuildingColumns,
  faChalkboardUser,
  faUserGraduate,
  faFont,
  faLanguage,
  faFlag,
  faEarthAsia,
  faMountainSun,
  faFlask,
  faLaptopCode,
  faCalculator,
  faBrain,
  faScaleBalanced,
  faCircle,
} from "@fortawesome/free-solid-svg-icons"

const map = {
  landmark: faLandmark,
  briefcase: faBriefcase,
  "building-columns": faBuildingColumns,
  "chalkboard-user": faChalkboardUser,
  "user-graduate": faUserGraduate,
  font: faFont,
  language: faLanguage,
  flag: faFlag,
  "earth-asia": faEarthAsia,
  "mountain-sun": faMountainSun,
  flask: faFlask,
  "laptop-code": faLaptopCode,
  calculator: faCalculator,
  brain: faBrain,
  "scale-balanced": faScaleBalanced,
}

/** Icon by name (for data-driven icons) or by FA icon object. */
export function Icon({ name, icon, className, ...rest }) {
  return <FontAwesomeIcon icon={icon || map[name] || faCircle} className={className} fixedWidth {...rest} />
}
