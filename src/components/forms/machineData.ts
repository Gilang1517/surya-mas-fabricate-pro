import { useMachines } from '@/hooks/useMachines';

// For compatibility with existing code, we'll export this hook
export const useMachineData = () => {
  const { data: machines = [] } = useMachines();
  
  return machines.map(machine => ({
    id: machine.id,
    number: machine.asset_number,
    name: machine.name,
  }));
};

// Keep the static export for immediate use in forms
export const machines = [
  { id: '1', number: 'EXC-001', name: 'Excavator CAT 320D' },
  { id: '2', number: 'BLD-001', name: 'Bulldozer D6T' },
  { id: '3', number: 'CRN-001', name: 'Mobile Crane 25T' },
  { id: '4', number: 'GDR-001', name: 'Motor Grader 140M' },
];
