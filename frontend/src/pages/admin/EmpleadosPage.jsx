import React from 'react';
import EmpleadosList from '../../components/common/empleados/EmpleadoList';
import EmpleadoForm from '../../components/common/empleados/EmpleadoForm';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { UserPlus } from 'lucide-react';

const EmpleadosPage = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleEmployeeCreated = () => {
    setDialogOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Empleados</h1>
        <Button onClick={handleOpenDialog} className="flex items-center gap-2">
          <UserPlus size={16} />
          <span>Nuevo Empleado</span>
        </Button>
      </div>

      <EmpleadosList key={refreshKey} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Empleado</DialogTitle>
          </DialogHeader>
          <EmpleadoForm onSuccess={handleEmployeeCreated} onCancel={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmpleadosPage;