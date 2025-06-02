
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash, Database, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TableColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'uuid' | 'email';
  nullable: boolean;
  defaultValue?: string;
  primaryKey?: boolean;
  foreignKey?: string;
}

interface TableSchema {
  id: string;
  name: string;
  description: string;
  columns: TableColumn[];
  createdAt: string;
}

const TableEditor = () => {
  const { toast } = useToast();
  const [schemas, setSchemas] = useState<TableSchema[]>([]);
  const [editingSchema, setEditingSchema] = useState<TableSchema | null>(null);

  const [newSchema, setNewSchema] = useState({
    name: '',
    description: '',
    columns: [] as TableColumn[]
  });

  const [newColumn, setNewColumn] = useState({
    name: '',
    type: 'text' as TableColumn['type'],
    nullable: true,
    defaultValue: '',
    primaryKey: false,
    foreignKey: ''
  });

  const addColumn = () => {
    if (!newColumn.name) {
      toast({
        title: "Error",
        description: "Nama kolom harus diisi",
        variant: "destructive"
      });
      return;
    }

    const column: TableColumn = {
      id: Date.now().toString(),
      name: newColumn.name,
      type: newColumn.type,
      nullable: newColumn.nullable,
      defaultValue: newColumn.defaultValue || undefined,
      primaryKey: newColumn.primaryKey,
      foreignKey: newColumn.foreignKey || undefined
    };

    if (editingSchema) {
      setEditingSchema(prev => prev ? {
        ...prev,
        columns: [...prev.columns, column]
      } : null);
    } else {
      setNewSchema(prev => ({
        ...prev,
        columns: [...prev.columns, column]
      }));
    }

    setNewColumn({
      name: '',
      type: 'text',
      nullable: true,
      defaultValue: '',
      primaryKey: false,
      foreignKey: ''
    });

    toast({
      title: "Kolom ditambahkan",
      description: "Kolom berhasil ditambahkan ke tabel",
    });
  };

  const saveSchema = () => {
    const schemaData = editingSchema || newSchema;
    
    if (!schemaData.name || schemaData.columns.length === 0) {
      toast({
        title: "Error",
        description: "Nama tabel dan minimal satu kolom harus diisi",
        variant: "destructive"
      });
      return;
    }

    const schema: TableSchema = {
      id: editingSchema?.id || Date.now().toString(),
      name: schemaData.name,
      description: schemaData.description,
      columns: schemaData.columns,
      createdAt: editingSchema?.createdAt || new Date().toISOString().split('T')[0]
    };

    if (editingSchema) {
      setSchemas(prev => prev.map(s => s.id === schema.id ? schema : s));
      setEditingSchema(null);
      toast({
        title: "Schema diupdate",
        description: "Schema tabel berhasil diupdate",
      });
    } else {
      setSchemas(prev => [...prev, schema]);
      toast({
        title: "Schema disimpan",
        description: "Schema tabel berhasil disimpan",
      });
    }

    setNewSchema({ name: '', description: '', columns: [] });
  };

  const editSchema = (schema: TableSchema) => {
    setEditingSchema(schema);
    setNewSchema({
      name: schema.name,
      description: schema.description,
      columns: schema.columns
    });
  };

  const deleteSchema = (id: string) => {
    setSchemas(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Schema dihapus",
      description: "Schema tabel berhasil dihapus",
    });
  };

  const generateSQL = (schema: TableSchema) => {
    const columns = schema.columns.map(col => {
      let sql = `  ${col.name} `;
      
      // Type mapping
      switch (col.type) {
        case 'text':
          sql += 'character varying';
          break;
        case 'number':
          sql += 'numeric';
          break;
        case 'date':
          sql += 'date';
          break;
        case 'boolean':
          sql += 'boolean';
          break;
        case 'uuid':
          sql += 'uuid';
          break;
        case 'email':
          sql += 'character varying';
          break;
      }

      if (!col.nullable) sql += ' NOT NULL';
      if (col.defaultValue) sql += ` DEFAULT ${col.defaultValue}`;
      if (col.primaryKey) sql += ' PRIMARY KEY';

      return sql;
    }).join(',\n');

    return `CREATE TABLE ${schema.name} (\n${columns}\n);`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Table Schema Editor</h3>
      </div>

      <div className="grid gap-6">
        {/* Schema Builder */}
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSchema ? 'Edit Schema' : 'Buat Schema Tabel Baru'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schemaName">Nama Tabel</Label>
                <Input
                  id="schemaName"
                  value={editingSchema?.name || newSchema.name}
                  onChange={(e) => editingSchema ? 
                    setEditingSchema(prev => prev ? {...prev, name: e.target.value} : null) :
                    setNewSchema(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="nama_tabel"
                />
              </div>
              
              <div>
                <Label htmlFor="schemaDescription">Deskripsi</Label>
                <Input
                  id="schemaDescription"
                  value={editingSchema?.description || newSchema.description}
                  onChange={(e) => editingSchema ? 
                    setEditingSchema(prev => prev ? {...prev, description: e.target.value} : null) :
                    setNewSchema(prev => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Deskripsi tabel"
                />
              </div>
            </div>

            {/* Add Column Section */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Tambah Kolom</h4>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <Label>Nama Kolom</Label>
                  <Input
                    value={newColumn.name}
                    onChange={(e) => setNewColumn(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="nama_kolom"
                  />
                </div>
                <div>
                  <Label>Tipe Data</Label>
                  <select 
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                    value={newColumn.type}
                    onChange={(e) => setNewColumn(prev => ({ ...prev, type: e.target.value as TableColumn['type'] }))}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="boolean">Boolean</option>
                    <option value="uuid">UUID</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                <div>
                  <Label>Default Value</Label>
                  <Input
                    value={newColumn.defaultValue}
                    onChange={(e) => setNewColumn(prev => ({ ...prev, defaultValue: e.target.value }))}
                    placeholder="default value"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="nullable"
                    checked={newColumn.nullable}
                    onChange={(e) => setNewColumn(prev => ({ ...prev, nullable: e.target.checked }))}
                  />
                  <Label htmlFor="nullable">Nullable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="primaryKey"
                    checked={newColumn.primaryKey}
                    onChange={(e) => setNewColumn(prev => ({ ...prev, primaryKey: e.target.checked }))}
                  />
                  <Label htmlFor="primaryKey">Primary Key</Label>
                </div>
              </div>

              <Button onClick={addColumn} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kolom
              </Button>
            </div>

            {/* Columns Preview */}
            {((editingSchema?.columns || newSchema.columns).length > 0) && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Kolom dalam Tabel</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Nullable</TableHead>
                      <TableHead>Default</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(editingSchema?.columns || newSchema.columns).map((column) => (
                      <TableRow key={column.id}>
                        <TableCell className="font-medium">
                          {column.name}
                          {column.primaryKey && <Badge variant="destructive" className="ml-2">PK</Badge>}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{column.type}</Badge>
                        </TableCell>
                        <TableCell>{column.nullable ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{column.defaultValue || '-'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              if (editingSchema) {
                                setEditingSchema(prev => prev ? {
                                  ...prev,
                                  columns: prev.columns.filter(c => c.id !== column.id)
                                } : null);
                              } else {
                                setNewSchema(prev => ({
                                  ...prev,
                                  columns: prev.columns.filter(c => c.id !== column.id)
                                }));
                              }
                            }}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="flex gap-2 mt-4">
                  <Button onClick={saveSchema} className="flex-1">
                    <Database className="w-4 h-4 mr-2" />
                    {editingSchema ? 'Update Schema' : 'Simpan Schema'}
                  </Button>
                  {editingSchema && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingSchema(null);
                        setNewSchema({ name: '', description: '', columns: [] });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schema List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Schema Tabel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schemas.map((schema) => (
                <div key={schema.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{schema.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{schema.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{schema.columns.length} columns</Badge>
                        <span className="text-xs text-gray-500">Created: {schema.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => editSchema(schema)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          const sql = generateSQL(schema);
                          navigator.clipboard.writeText(sql);
                          toast({
                            title: "SQL disalin",
                            description: "SQL CREATE TABLE berhasil disalin ke clipboard",
                          });
                        }}
                      >
                        <Code className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteSchema(schema.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {schemas.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Belum ada schema yang dibuat
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TableEditor;
