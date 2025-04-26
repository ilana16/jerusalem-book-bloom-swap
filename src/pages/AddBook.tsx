
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const conditions = ["Like New", "Very Good", "Good", "Fair", "Poor"];

const neighborhoods = [
  "Baka",
  "German Colony",
  "Katamon",
  "Rehavia",
  "City Center",
  "Talpiot",
  "Arnona",
  "French Hill",
  "Ramot",
  "Gilo",
  "Pisgat Ze'ev",
  "Har Nof",
  "Bayit Vegan",
  "Nachlaot",
  "Kiryat Moshe",
  "Old City"
];

const coverColors = [
  { name: "Blue", value: "#436B95" },
  { name: "Green", value: "#4A6741" },
  { name: "Red", value: "#9C4A41" },
  { name: "Purple", value: "#5D4A9C" },
  { name: "Orange", value: "#BC6C25" },
  { name: "Teal", value: "#2A9D8F" },
];

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    condition: "",
    neighborhood: "",
    coverColor: "#436B95"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, coverColor: color }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would send this data to the backend
    toast({
      title: "Book added successfully!",
      description: "Your book is now available for swapping.",
    });
    
    // Redirect to books page
    navigate("/books");
  };

  return (
    <Layout>
      <div className="page-container max-w-3xl mx-auto">
        <h1 className="section-heading">Add Your Book</h1>
        
        <div className="bg-white border border-border rounded-lg p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Book Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter the book title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter the author's name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description or synopsis of the book"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange("condition", value)}
                    required
                  >
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map(condition => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Your Neighborhood *</Label>
                  <Select
                    value={formData.neighborhood}
                    onValueChange={(value) => handleSelectChange("neighborhood", value)}
                    required
                  >
                    <SelectTrigger id="neighborhood">
                      <SelectValue placeholder="Select neighborhood" />
                    </SelectTrigger>
                    <SelectContent>
                      {neighborhoods.map(neighborhood => (
                        <SelectItem key={neighborhood} value={neighborhood}>
                          {neighborhood}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Book Cover Color</Label>
                <div className="grid grid-cols-6 gap-3">
                  {coverColors.map(color => (
                    <div 
                      key={color.value}
                      className={`h-12 rounded-md cursor-pointer transition-all border-2 ${
                        formData.coverColor === color.value 
                          ? 'border-black scale-105' 
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleColorSelect(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-bookswap-darkblue hover:bg-bookswap-darkblue/90"
                >
                  Add Book to Swap List
                </Button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>All books added are available for swapping. There are no points or financial transactions.</p>
          <p>Book Swap Jerusalem is based on goodwill and community sharing.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AddBook;
