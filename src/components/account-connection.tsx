"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Plus,
  Upload,
  PencilLine,
  Building,
  FileSpreadsheet,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createNewAccount } from "@/actions/account/create-new-account";
import { cn } from "@/lib/utils";
import { AccountType } from "@prisma/client";

interface BankConnectionProps {
  onAccountAdded?: () => void;
}

interface CSVColumn {
  header: string;
  index: number;
}

interface CSVMapping {
  date?: number;
  description?: number;
  amount?: number;
  type?: number;
}

interface AccountDetails {
  name: string;
  bankName: string;
  accountType: AccountType;
  currency: string;
  balance?: string;
}

export function AddBankAccountComponent({
  onAccountAdded,
}: BankConnectionProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [connectionType, setConnectionType] = useState<
    "manual" | "import" | null
  >(null);
  const [bankProvider, setBankProvider] = useState<
    "chase" | "wellsfargo" | "bankofamerica" | null
  >(null);
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [csvColumns, setCSVColumns] = useState<CSVColumn[]>([]);
  const [columnMapping, setColumnMapping] = useState<CSVMapping>({});
  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    name: "",
    bankName: "",
    accountType: AccountType.BANK,
    currency: "USD",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCSVFile(file);
      // Read the CSV file and extract headers
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const headers = text.split("\n")[0].split(",");
        setCSVColumns(
          headers.map((header, index) => ({
            header: header.trim(),
            index,
          })),
        );
      };
      reader.readAsText(file);
    } else {
      toast.error("Please upload a valid CSV file");
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      setCSVFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const headers = text.split("\n")[0].split(",");
        setCSVColumns(
          headers.map((header, index) => ({
            header: header.trim(),
            index,
          })),
        );
      };
      reader.readAsText(file);
    } else {
      toast.error("Please upload a valid CSV file");
    }
  }

  async function handleNext() {
    if (step === 1 && connectionType) {
      if (connectionType === "manual") {
        setStep(3); // CSV upload
      } else {
        setStep(2);
      }
    } else if (step === 2 && bankProvider) {
      toast.info("Bank integration coming soon!", {
        description: `Connection to ${bankProvider.toUpperCase()} is not yet available.`,
      });
      setOpen(false);
      resetState();
    } else if (step === 3 && csvFile) {
      setStep(4); // Account details
    } else if (step === 4 && isValidAccountDetails()) {
      setStep(5); // Column mapping
    } else if (step === 5 && isValidMapping() && csvFile) {
      try {
        setIsLoading(true); // Start loading
        console.log("Starting account creation...");

        // Read file content before sending to server action
        const fileContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = (e) => reject(e);
          reader.readAsText(csvFile);
        });

        const result = await createNewAccount({
          name: accountDetails.name,
          bankName: accountDetails.bankName,
          accountType: accountDetails.accountType,
          currency: accountDetails.currency,
          balance: accountDetails.balance,
          csvData: {
            date: columnMapping.date!,
            description: columnMapping.description!,
            amount: columnMapping.amount!,
          },
          csvContent: fileContent,
        });

        console.log("Account creation result:", result);

        if (result.success) {
          toast.success("Account and transactions added!", {
            description: "Your account has been set up successfully.",
          });
          onAccountAdded?.();
        } else {
          toast.error("Failed to add account", {
            description: result.error || "Unknown error occurred",
          });
        }
      } catch (error) {
        console.error("Full error:", error);
        toast.error("Failed to add account", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      } finally {
        setIsLoading(false); // Stop loading regardless of outcome
        setOpen(false);
        resetState();
      }
    }
  }

  function isValidMapping() {
    return (
      columnMapping.date !== undefined &&
      columnMapping.amount !== undefined &&
      columnMapping.description !== undefined
    );
  }

  function isValidAccountDetails() {
    return (
      accountDetails.name.trim() !== "" &&
      accountDetails.bankName.trim() !== "" &&
      accountDetails.currency.trim() !== ""
    );
  }

  function resetState() {
    setStep(1);
    setConnectionType(null);
    setBankProvider(null);
    setCSVFile(null);
    setCSVColumns([]);
    setColumnMapping({});
    setAccountDetails({
      name: "",
      bankName: "",
      accountType: AccountType.BANK,
      currency: "USD",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4" /> Add Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Processing your account...
              </p>
            </div>
          </div>
        )}
        <DialogHeader>
          <DialogTitle>
            {step === 1
              ? "Add Bank Account"
              : step === 2
                ? "Select Your Bank"
                : step === 3
                  ? "Upload CSV File"
                  : step === 4
                    ? "Account Details"
                    : "Map CSV Columns"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-muted-foreground text-center mb-6">
            {step === 1
              ? "Choose how you want to add your bank account"
              : step === 2
                ? "Connect to your bank for automatic import"
                : step === 3
                  ? "Upload your bank statement CSV file"
                  : step === 4
                    ? "Enter your account details"
                    : "Map your CSV columns to the correct fields"}
          </p>

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <SelectableCard
                icon={<Upload className="h-10 w-10 mb-3" />}
                title="Import from Bank"
                description="Securely connect to your bank for automatic import"
                isSelected={connectionType === "import"}
                onClick={() => setConnectionType("import")}
              />
              <SelectableCard
                icon={<PencilLine className="h-10 w-10 mb-3" />}
                title="Manual Entry"
                description="Manually enter your bank account details"
                isSelected={connectionType === "manual"}
                onClick={() => setConnectionType("manual")}
              />
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <SelectableCard
                icon={<Building className="h-10 w-10 mb-3" />}
                title="Chase"
                description="Connect your Chase bank account"
                isSelected={bankProvider === "chase"}
                onClick={() => setBankProvider("chase")}
              />
              <SelectableCard
                icon={<Building2 className="h-10 w-10 mb-3" />}
                title="Wells Fargo"
                description="Connect your Wells Fargo account"
                isSelected={bankProvider === "wellsfargo"}
                onClick={() => setBankProvider("wellsfargo")}
              />
              <SelectableCard
                icon={<Building2 className="h-10 w-10 mb-3" />}
                title="Bank of America"
                description="Connect your Bank of America account"
                isSelected={bankProvider === "bankofamerica"}
                onClick={() => setBankProvider("bankofamerica")}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div
                className={cn(
                  "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ease-in-out",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50",
                  "relative",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center text-center">
                  <FileSpreadsheet
                    className={cn(
                      "h-10 w-10 mb-3",
                      isDragging ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <p className="text-sm font-medium mb-1">
                    {isDragging
                      ? "Drop your CSV file here"
                      : "Upload your bank statement"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  {!csvFile && (
                    <Button variant="secondary" size="sm" className="mt-2">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  )}
                </div>
              </div>

              {csvFile && (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{csvFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(csvFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCSVFile(null);
                      setCSVColumns([]);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    placeholder="e.g., Main Checking Account"
                    value={accountDetails.name}
                    onChange={(e) =>
                      setAccountDetails({
                        ...accountDetails,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select
                    value={accountDetails.accountType}
                    onValueChange={(value: AccountType) =>
                      setAccountDetails({
                        ...accountDetails,
                        accountType: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AccountType.BANK}>
                        Checking Account
                      </SelectItem>
                      <SelectItem value={AccountType.SAVINGS}>
                        Savings Account
                      </SelectItem>
                      <SelectItem value={AccountType.INVESTMENT}>
                        Investment Account
                      </SelectItem>
                      <SelectItem value={AccountType.CRYPTO}>
                        Crypto Account
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="e.g., Chase Bank"
                    value={accountDetails.bankName}
                    onChange={(e) =>
                      setAccountDetails({
                        ...accountDetails,
                        bankName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={accountDetails.currency}
                    onValueChange={(value) =>
                      setAccountDetails({
                        ...accountDetails,
                        currency: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="NOK">NOK - Norwegian Krone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="balance">Initial Balance (Optional)</Label>
                  <Input
                    id="balance"
                    type="number"
                    placeholder="0.00"
                    value={accountDetails.balance}
                    onChange={(e) =>
                      setAccountDetails({
                        ...accountDetails,
                        balance: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-2 items-center">
                  <span className="text-sm">Date</span>
                  <Select
                    onValueChange={(value) =>
                      setColumnMapping({
                        ...columnMapping,
                        date: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvColumns.map((col) => (
                        <SelectItem
                          key={col.index}
                          value={col.index.toString()}
                        >
                          {col.header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2 items-center">
                  <span className="text-sm">Amount</span>
                  <Select
                    onValueChange={(value) =>
                      setColumnMapping({
                        ...columnMapping,
                        amount: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvColumns.map((col) => (
                        <SelectItem
                          key={col.index}
                          value={col.index.toString()}
                        >
                          {col.header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2 items-center">
                  <span className="text-sm">Description</span>
                  <Select
                    onValueChange={(value) =>
                      setColumnMapping({
                        ...columnMapping,
                        description: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvColumns.map((col) => (
                        <SelectItem
                          key={col.index}
                          value={col.index.toString()}
                        >
                          {col.header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={isLoading}
              >
                Back
              </Button>
            )}
            <Button
              className="ml-auto"
              onClick={handleNext}
              disabled={
                isLoading ||
                (step === 1 && !connectionType) ||
                (step === 2 && !bankProvider) ||
                (step === 3 && !csvFile) ||
                (step === 4 && !isValidAccountDetails()) ||
                (step === 5 && !isValidMapping())
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : step === 5 ? (
                "Complete"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SelectableCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

function SelectableCard({
  icon,
  title,
  description,
  isSelected,
  onClick,
}: SelectableCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? "border-primary shadow-md"
          : "hover:border-primary hover:shadow-sm"
      }`}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center text-center p-4">
        {icon}
        <h3 className="text-base font-semibold mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
