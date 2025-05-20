import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import ActivosList from '../../components/common/activos/ActivosList';
import ActivoForm from '../../components/common/activos/ActivoForm';

const ActivosPage = () => {
  const [activeTab, setActiveTab] = useState('hardware');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);
  
  const handleActivoCreated = () => {
    setDialogOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Activos</h1>
        <Button onClick={handleOpenDialog} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nuevo Activo</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="hardware">Hardware</TabsTrigger>
          <TabsTrigger value="software">Licencias Software</TabsTrigger>
          <TabsTrigger value="accesos">Accesos Web</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hardware">
          <ActivosList 
            key={`hardware-${refreshKey}`} 
            tipoActivo="HARDWARE"
            titulo="Activos de Hardware" 
          />
        </TabsContent>
        
        <TabsContent value="software">
          <ActivosList 
            key={`software-${refreshKey}`} 
            tipoActivo="SOFTWARE"
            titulo="Licencias de Software" 
          />
        </TabsContent>
        
        <TabsContent value="accesos">
          <ActivosList 
            key={`accesos-${refreshKey}`} 
            tipoActivo="ACCESO_WEB"
            titulo="Accesos Web" 
          />
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Activo</DialogTitle>
          </DialogHeader>
          <ActivoForm 
            tipoActivo={activeTab === 'hardware' ? 'HARDWARE' : activeTab === 'software' ? 'SOFTWARE' : 'ACCESO_WEB'} 
            onSuccess={handleActivoCreated} 
            onCancel={handleCloseDialog} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivosPage;