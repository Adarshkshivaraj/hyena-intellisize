import { MachinesRawData } from '../models/machine-data.model';

/**
 * Source dataset. This is the single place the raw JSON lives; it is consumed
 * exclusively through {@link MachineDataService} so components stay generic.
 */
export const MACHINES_DATA: MachinesRawData = {
  "Emergency&Routine": {
    "Average": "635.0,22.0,4994.9",
    "BoneRemoval": "196.8,20.0,1688.8",
    "TableRemoval": "444.0,21.6,4171.4",
    "Osteo": "162.1,13.1,1394.8",
    "ROI Threshold": "175.4,14.2,1456.9",
    "Midlineshift": "183.7,15.8,1522.4",
    "BrainHyperdensityplus": "191.2,16.4,1598.7",
    "Endo": "204.6,17.1,1675.3",
    "Trauma": "218.9,18.3,1742.1"
  },
  "Cardiac": {
    "Coronary cockpit": "635.0,22.0,4994.9",
    "Vessels": "196.8,20.0,1688.8",
    "FFR": "444.0,21.6,4171.4",
    "CPR parallel ranges": "287.5,19.2,2314.7",
    "CPR radial ranges": "301.8,20.1,2488.6"
  },
  "Automation": {
    "LungCaD": "635.0,22.0,4994.9",
    "Anatomical ranges": "196.8,20.0,1688.8",
    "Parallel ranges": "444.0,21.6,4171.4",
    "Radial ranges": "172.3,13.7,1411.8",
    "Spine ranges": "185.6,14.9,1508.2"
  },
  "Neuro": {
    "AspetsScore": "635.0,22.0,4994.9",
    "DynAngio": "196.8,20.0,1688.8",
    "Stroke layout": "444.0,21.6,4171.4",
    "Neuro DSA": "213.4,16.5,1722.8",
    "VHD(no UI)": "198.7,15.3,1644.5"
  },
  "Dual Energy": {
    "Body Bone Removal": "635.0,22.0,4994.9",
    "Head Bone Removal": "196.8,20.0,1688.8",
    "Brain Hemorrhage": "444.0,21.6,4171.4",
    "RhoZ": "168.9,13.6,1402.4",
    "Lung Analysis": "182.5,14.8,1519.6",
    "Kidney Stones": "197.3,15.7,1632.1",
    "Liver VNC": "208.6,16.4,1718.3",
    "Monoenergetic Plus": "221.1,17.5,1834.9",
    "Gout": "176.8,14.1,1476.2",
    "Virtual Unenhanced": "233.7,18.2,1945.7",
    "Bone Marrow": "187.4,15.2,1567.5"
  },
  "Onco": {
    "Ribranges": "635.0,22.0,4994.9"
  },
  "Spectral Imaging": {
    "Interactive Spectral Imaging (ISI)": "635.0,22.0,4994.9",
    "BoneRemoval": "196.8,20.0,1688.8",
    "TableRemoval": "444.0,21.6,4171.4",
    "Osteo": "162.1,13.1,1394.8",
    "Midlineshift": "174.2,14.0,1438.6",
    "BrainHyperdensityplus": "188.5,15.6,1584.2",
    "Endo": "201.7,16.8,1698.5",
    "Trauma": "215.9,17.9,1812.7"
  }
};
