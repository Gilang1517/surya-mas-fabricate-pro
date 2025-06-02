
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Code, Database, Settings, Users, FileText, Plus, Edit, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select';
  label: string;
  required: boolean;
  options?: string[];
}

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  createdAt: string;
}

const Development = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('forms');
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([
    {
      id: '1',
      name: 'Form Registrasi Karyawan',
      description: 'Form untuk mendaftarkan karyawan baru',
      fields: [
        { id: '1', name: 'fullName', type: 'text', label: 'Nama Lengkap', required: true },
        { id: '2', name: 'email', type: 'email', label: 'Email', required: true },
        { id: '3', name: 'department', type: 'select', label: 'Departemen', required: true, options: ['IT', 'HR', 'Finance', 'Operations'] },
        { id: '4', name: 'joinDate', type: 'date', label: 'Tanggal Bergabung', required: true },
      ],
      createdAt: '2024-01-15'
    }
  ]);

  const [newForm, setNewForm] = useState({
    name: '',
    description: '',
    fields: [] as FormField[]
  });

  const [newField, setNewField] = useState({
    name: '',
    type: 'text' as FormField['type'],
    label: '',
    required: false,
    options: ''
  });

  const addField = () => {
    if (!newField.name || !newField.label) {
      toast({
        title: "Error",
        description: "Nama field dan label harus diisi",
        variant: "destructive"
      });
      return;
    }

    const field: FormField = {
      id: Date.now().toString(),
      name: newField.name,
      type: newField.type,
      label: newField.label,
      required: newField.required,
      options: newField.type === 'select' ? newField.options.split(',').map(o => o.trim()) : undefined
    };

    setNewForm(prev => ({
      ...prev,
      fields: [...prev.fields, field]
    }));

    setNewField({
      name: '',
      type: 'text',
      label: '',
      required: false,
      options: ''
    });

    toast({
      title: "Field ditambahkan",
      description: "Field berhasil ditambahkan ke form",
    });
  };

  const removeField = (fieldId: string) => {
    setNewForm(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId)
    }));
  };

  const saveForm = () => {
    if (!newForm.name || !newForm.description || newForm.fields.length === 0) {
      toast({
        title: "Error",
        description: "Nama, deskripsi, dan minimal satu field harus diisi",
        variant: "destructive"
      });
      return;
    }

    const template: FormTemplate = {
      id: Date.now().toString(),
      name: newForm.name,
      description: newForm.description,
      fields: newForm.fields,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setFormTemplates(prev => [...prev, template]);
    setNewForm({ name: '', description: '', fields: [] });

    toast({
      title: "Form disimpan",
      description: "Template form berhasil disimpan",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Development Dashboard</h1>
        <p className="text-gray-600 mt-2">Kelola dan kembangkan sistem aplikasi</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forms">
            <FileText className="w-4 h-4 mr-2" />
            Forms
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="w-4 h-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Form Builder */}
            <Card>
              <CardHeader>
                <CardTitle>Form Builder</CardTitle>
                <CardDescription>Buat form baru untuk sistem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="formName">Nama Form</Label>
                  <Input
                    id="formName"
                    value={newForm.name}
                    onChange={(e) => setNewForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Masukkan nama form"
                  />
                </div>
                <div>
                  <Label htmlFor="formDescription">Deskripsi</Label>
                  <Textarea
                    id="formDescription"
                    value={newForm.description}
                    onChange={(e) => setNewForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Deskripsi form"
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Tambah Field</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Nama Field</Label>
                        <Input
                          value={newField.name}
                          onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="fieldName"
                        />
                      </div>
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={newField.label}
                          onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                          placeholder="Label Field"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Tipe</Label>
                        <select 
                          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                          value={newField.type}
                          onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value as FormField['type'] }))}
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="password">Password</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Select</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <input
                          type="checkbox"
                          id="required"
                          checked={newField.required}
                          onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                        />
                        <Label htmlFor="required">Required</Label>
                      </div>
                    </div>
                    {newField.type === 'select' && (
                      <div>
                        <Label>Options (pisahkan dengan koma)</Label>
                        <Input
                          value={newField.options}
                          onChange={(e) => setNewField(prev => ({ ...prev, options: e.target.value }))}
                          placeholder="Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}
                    <Button onClick={addField} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Field
                    </Button>
                  </div>
                </div>

                {newForm.fields.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Fields dalam Form</h4>
                    <div className="space-y-2">
                      {newForm.fields.map((field) => (
                        <div key={field.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <span className="font-medium">{field.label}</span>
                            <Badge variant="outline" className="ml-2">{field.type}</Badge>
                            {field.required && <Badge variant="destructive" className="ml-1">Required</Badge>}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeField(field.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button onClick={saveForm} className="w-full mt-4">
                      Simpan Form Template
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Form Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Form Templates</CardTitle>
                <CardDescription>Template form yang sudah dibuat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{template.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{template.fields.length} fields</Badge>
                            <span className="text-xs text-gray-500">Created: {template.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Code className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>Kelola skema database dan migrasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Database className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Fitur database management akan segera hadir</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Konfigurasi sistem dan pengaturan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Fitur system configuration akan segera hadir</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Kelola pengguna dan hak akses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Fitur user management akan segera hadir</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Development;
