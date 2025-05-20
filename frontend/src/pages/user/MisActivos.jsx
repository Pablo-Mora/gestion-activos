import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { getActivosById } from '../../api/activos';
import { getActasUsuario } from '../../api/actas';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { 
  Card,
  CardContent
} from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Eye } from 'lucide-react';
import ActaDetail from '../../components/common/actas/ActaDetails';

const MisActivos = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activos, setActivos] = useState([]);
  const [actas, setActas] = useState([]);
  const [activeTab, setActiveTab] = useState('hardware');
  const [selectedActa, setSelectedActa] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Obtener activos asignados al usuario
        const activosData = await getActivosUsuario();
        setActivos(activosData);
        
        // Obtener actas del usuario
        const actasData = await getActasUsuario();
        setActas(actasData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar sus activos. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const filteredActivos = () => {
    switch(activeTab) {
      case 'hardware':
        return activos.filter(activo => activo.tipo === 'HARDWARE');
      case 'software':
        return activos.filter(activo => activo.tipo === 'SOFTWARE');
      case 'accesos':
        return activos.filter(activo => activo.tipo === 'ACCESO_WEB');
      default:
        return [];
    }
  };

  const handleOpenActaDetail = (acta) => {
    setSelectedActa(acta);
    setDetailDialogOpen(true);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mis Activos</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="hardware">Hardware</TabsTrigger>
          <TabsTrigger value="software">Software</TabsTrigger>
          <TabsTrigger value="accesos">Accesos Web</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hardware">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Marca/Modelo</TableHead>
                    <TableHead>Serial</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivos().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No tiene activos de hardware asignados
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActivos().map((activo) => (
                      <TableRow key={activo.id}>
                        <TableCell className="font-medium">{activo.nombre}</TableCell>
                        <TableCell>{activo.categoria}</TableCell>
                        <TableCell>{`${activo.marca || '-'} / ${activo.modelo || '-'}`}</TableCell>
                        <TableCell>{activo.numeroSerial || '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            activo.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activo.estado}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="software">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Versión</TableHead>
                    <TableHead>Tipo Licencia</TableHead>
                    <TableHead>Fecha Vencimiento</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivos().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No tiene licencias de software asignadas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActivos().map((activo) => (
                      <TableRow key={activo.id}>
                        <TableCell className="font-medium">{activo.nombre}</TableCell>
                        <TableCell>{activo.version || '-'}</TableCell>
                        <TableCell>{activo.tipoLicencia}</TableCell>
                        <TableCell>{activo.fechaVencimiento || 'Perpetua'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            activo.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activo.estado}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="accesos">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Nivel Acceso</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivos().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No tiene accesos web asignados
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActivos().map((activo) => (
                      <TableRow key={activo.id}>
                        <TableCell className="font-medium">{activo.nombre}</TableCell>
                        <TableCell>{activo.url || '-'}</TableCell>
                        <TableCell>{activo.nombreUsuario || '-'}</TableCell>
                        <TableCell>{activo.nivelAcceso}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            activo.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activo.estado}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <h2 className="text-xl font-semibold mb-4 mt-8">Mis Actas de Entrega</h2>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Responsable Entrega</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No tiene actas de entrega registradas
                  </TableCell>
                </TableRow>
              ) : (
                actas.map((acta) => (
                  <TableRow key={acta.id}>
                    <TableCell className="font-medium">{acta.numeroActa}</TableCell>
                    <TableCell>{new Date(acta.fechaCreacion).toLocaleDateString()}</TableCell>
                    <TableCell>{acta.responsableEntrega?.nombre || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        acta.estado === 'APROBADA' ? 'bg-green-100 text-green-800' : 
                        acta.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {acta.estado}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenActaDetail(acta)}>
                        <Eye size={16} />
                        <span className="sr-only">Ver Detalles</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para ver detalles del acta */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Detalles del Acta de Entrega</DialogTitle>
          </DialogHeader>
          {selectedActa && <ActaDetail acta={selectedActa} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MisActivos;