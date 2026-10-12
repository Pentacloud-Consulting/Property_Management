import dbConnect from "@/lib/db";
import PropertyExpense, { IPropertyExpenseDocument } from "@/models/PropertyExpense";
import ActivityLog from "@/models/ActivityLog";
import { ExpenseFormValues } from "@/validators/expense.validator";
import { PaginationParams, PaginatedResponse } from "@/types";

export class ExpenseService {
  static async getExpenses(
    params: PaginationParams & { propertyId?: string; unitId?: string; category?: string; status?: string }
  ): Promise<PaginatedResponse<IPropertyExpenseDocument>> {
    await dbConnect();
    
    const { page = 1, limit = 10, search, sortBy = "date", sortOrder = "desc", propertyId, unitId, category, status } = params;
    
    const query: any = {};
    
    if (propertyId) query.propertyId = propertyId;
    if (unitId) query.unitId = unitId;
    if (category) query.category = category;
    if (status) query.status = status;

    const sortOptions: any = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
    
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      PropertyExpense.find(query)
        .populate("propertyId", "propertyName")
        .populate("unitId", "unitNumber")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      PropertyExpense.countDocuments(query),
    ]);

    return {
      data: data as unknown as IPropertyExpenseDocument[],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getExpenseById(id: string): Promise<IPropertyExpenseDocument | null> {
    await dbConnect();
    return PropertyExpense.findById(id)
      .populate("propertyId", "propertyName address")
      .populate("unitId", "unitNumber")
      .lean() as unknown as IPropertyExpenseDocument | null;
  }

  static async createExpense(data: ExpenseFormValues): Promise<IPropertyExpenseDocument> {
    await dbConnect();

    // If paidDate is provided, automatically set status to Paid
    const formattedData: any = { ...data };
    if (formattedData.paidDate && formattedData.status === "Pending") {
      formattedData.status = "Paid";
    }

    const count = await PropertyExpense.countDocuments();
    formattedData.expenseNumber = `EXP-${(count + 1).toString().padStart(4, "0")}`;

    const expense = await PropertyExpense.create(formattedData);
    
    await ActivityLog.create({
      action: "CREATE",
      entityType: "PropertyExpense",
      entityId: expense._id,
      description: `Logged property expense: ${data.category} for $${data.amount}`,
    });

    return expense;
  }

  static async updateExpense(
    id: string,
    data: Partial<ExpenseFormValues>
  ): Promise<IPropertyExpenseDocument | null> {
    await dbConnect();
    
    const formattedData: any = { ...data };
    if (formattedData.status === "Paid" && !formattedData.paidDate) {
      formattedData.paidDate = new Date().toISOString() as any;
    }

    const expense = await PropertyExpense.findByIdAndUpdate(
      id,
      { $set: formattedData },
      { new: true, runValidators: true }
    );

    if (expense) {
      await ActivityLog.create({
        action: "UPDATE",
        entityType: "PropertyExpense",
        entityId: expense._id,
        description: `Updated property expense ${expense.category}`,
      });
    }

    return expense;
  }

  static async deleteExpense(id: string): Promise<boolean> {
    await dbConnect();
    
    const expense = await PropertyExpense.findById(id);
    if (!expense) return false;

    await PropertyExpense.findByIdAndDelete(id);
    
    await ActivityLog.create({
      action: "DELETE",
      entityType: "PropertyExpense",
      entityId: id,
      description: `Deleted property expense`,
    });

    return true;
  }
}
