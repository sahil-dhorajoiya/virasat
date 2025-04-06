import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Maintenance from '@/lib/models/maintenance';
import Product from '@/lib/models/product';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    
    let query: any = {};
    
    if (productId) query.productId = productId;
    if (status) query.status = status;
    if (type) query.type = type;
    
    const maintenanceRecords = await Maintenance.find(query)
      .populate('productId')
      .sort({ washDate: -1 });
      
    return NextResponse.json(maintenanceRecords);
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance records' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Check if product exists
    const product = await Product.findById(body.productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Create maintenance record
    const maintenance = await Maintenance.create(body);
    const populatedMaintenance = await Maintenance.findById(maintenance._id)
      .populate('productId');
    
    return NextResponse.json(populatedMaintenance, { status: 201 });
  } catch (error) {
    console.error('Error creating maintenance record:', error);
    return NextResponse.json(
      { error: 'Failed to create maintenance record' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Maintenance ID is required' },
        { status: 400 }
      );
    }
    
    const body = await req.json();
    const maintenance = await Maintenance.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate('productId');
    
    if (!maintenance) {
      return NextResponse.json(
        { error: 'Maintenance record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(maintenance);
  } catch (error) {
    console.error('Error updating maintenance record:', error);
    return NextResponse.json(
      { error: 'Failed to update maintenance record' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Maintenance ID is required' },
        { status: 400 }
      );
    }
    
    const maintenance = await Maintenance.findByIdAndDelete(id);
    
    if (!maintenance) {
      return NextResponse.json(
        { error: 'Maintenance record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting maintenance record:', error);
    return NextResponse.json(
      { error: 'Failed to delete maintenance record' },
      { status: 500 }
    );
  }
} 