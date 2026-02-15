import DeviceStateTest from '../components/common/DeviceStateTest';
import { RuleList, RuleCreate, RuleEdit, RuleDetails } from '../containers/RuleEngine';

export const routes = [
  {
    path: '/debug/device-state-test',
    element: <DeviceStateTest />
  },
  {
    path: '/rule-engine',
    element: <RuleList />,
  },
  {
    path: '/rule-engine/create',
    element: <RuleCreate />,
  },
  {
    path: '/rule-engine/:id',
    element: <RuleDetails />,
  },
  {
    path: '/rule-engine/:id/edit',
    element: <RuleEdit />,
  },
]; 