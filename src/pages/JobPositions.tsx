import { useEffect, useState, useRef } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Printer, Plus } from "lucide-react";

const columns = [
  "id", "title", "description", "requirements", "department", "location", "employment_type", "salary_min", "salary_max", "currency", "status", "created_at", "updated_at"
];

export default function JobPositions() {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    requirements: "",
    department: "",
    location: "",
    employment_type: "full-time",
    salary_min: "",
    salary_max: "",
    currency: "USD",
    status: "active"
  });
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const fetchPositions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/jobpositions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      const data = await res.json();
      setPositions(data.positions || []);
    } catch (e) {
      setError("Could not load job positions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPositions(); }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `http://localhost:5000/api/jobpositions/${editId}` : "http://localhost:5000/api/jobpositions";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save job position");
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        requirements: "",
        department: "",
        location: "",
        employment_type: "full-time",
        salary_min: "",
        salary_max: "",
        currency: "USD",
        status: "active"
      });
      setEditId(null);
      fetchPositions();
    } catch (e) {
      setError("Failed to save job position");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (pos: any) => {
    setEditId(pos.id);
    setForm({ ...pos });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this job position?")) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/jobpositions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (!res.ok) throw new Error();
      fetchPositions();
    } catch {
      setError("Failed to delete job position");
    } finally {
      setSaving(false);
    }
  };

  const handlePrintTable = () => {
    if (!tableRef.current) return;
    const printContents = tableRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=900');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Job Positions Table</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
              th { background: #f3f3f3; }
              .actions { display: none; }
            </style>
          </head>
          <body>
            <h2>Job Positions Table</h2>
            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 300);
    }
  };

  // Filter positions by keyword
  const filteredPositions = keyword.trim() === ""
    ? positions
    : positions.filter((pos: any) => {
        const kw = keyword.toLowerCase();
        return (
          (pos.title && pos.title.toLowerCase().includes(kw)) ||
          (pos.description && pos.description.toLowerCase().includes(kw)) ||
          (pos.requirements && pos.requirements.toLowerCase().includes(kw)) ||
          (pos.department && pos.department.toLowerCase().includes(kw)) ||
          (pos.location && pos.location.toLowerCase().includes(kw)) ||
          (pos.employment_type && pos.employment_type.toLowerCase().includes(kw)) ||
          (pos.status && pos.status.toLowerCase().includes(kw)) ||
          (pos.currency && pos.currency.toLowerCase().includes(kw)) ||
          (pos.salary_min && String(pos.salary_min).toLowerCase().includes(kw)) ||
          (pos.salary_max && String(pos.salary_max).toLowerCase().includes(kw))
        );
      });

  return (
    <div className="p-6 space-y-6 font-sf max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between w-full">
            <CardTitle>Job Positions</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" title="Print Table" onClick={handlePrintTable}>
                <Printer className="w-5 h-5" />
              </Button>
              <Button variant="default" size="icon" title="Add Job Position" onClick={() => { setShowForm(true); setEditId(null); setForm({
                title: "",
                description: "",
                requirements: "",
                department: "",
                location: "",
                employment_type: "full-time",
                salary_min: "",
                salary_max: "",
                currency: "USD",
                status: "active"
              }); }}>
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-1">These are the main <code>job positions</code> provided through the database.</p>
        </CardHeader>
        <CardContent>
          {/* Keyword filter input */}
          <div className="mb-4 max-w-md">
            <Input
              placeholder="Type anything to filter job positions (title, department, location, etc)"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
              <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
              <Input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
              <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
              <Input name="employment_type" placeholder="Employment Type (full-time, part-time, contract, internship)" value={form.employment_type} onChange={handleChange} required />
              <Input name="salary_min" placeholder="Salary Min" value={form.salary_min} onChange={handleChange} required type="number" />
              <Input name="salary_max" placeholder="Salary Max" value={form.salary_max} onChange={handleChange} required type="number" />
              <Input name="currency" placeholder="Currency (e.g. USD)" value={form.currency} onChange={handleChange} required />
              <Input name="status" placeholder="Status (active, paused, closed)" value={form.status} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="col-span-2 border rounded p-2" required />
              <textarea name="requirements" placeholder="Requirements" value={form.requirements} onChange={handleChange} className="col-span-2 border rounded p-2" required />
              <div className="col-span-2 flex gap-2">
                <Button type="submit" disabled={saving}>{editId ? "Update" : "Add"} Job Position</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</Button>
              </div>
            </form>
          )}
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <div ref={tableRef} className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map(col => <TableHead key={col}>{col.replace(/_/g, ' ').toUpperCase()}</TableHead>)}
                  <TableHead className="actions">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={columns.length + 1}>Loading...</TableCell></TableRow>
                ) : positions.length === 0 ? (
                  <TableRow><TableCell colSpan={columns.length + 1}>No job positions found.</TableCell></TableRow>
                ) : filteredPositions.map(pos => (
                  <TableRow key={pos.id}>
                    {columns.map(col => <TableCell key={col}>{String(pos[col] ?? "")}</TableCell>)}
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(pos)} className="mr-2 text-md">Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(pos.id)} className="text-md">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 