import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Package from '@/lib/models/package';
import Product from '@/lib/models/product';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get('isActive');
    
    let query: any = {};
    
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    const packages = await Package.find(query)
      .populate('items.productId');
      
    return NextResponse.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Validate all products exist and calculate total prices
    let totalRentPrice = 0;
    let totalSalePrice = 0;
    
    for (const item of body.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }
      
      totalRentPrice += product.rentPrice * item.quantity;
      totalSalePrice += product.salePrice * item.quantity;
    }
    
    // Apply discount
    if (body.discountType === 'percentage') {
      totalRentPrice = totalRentPrice * (1 - body.discountValue / 100);
      totalSalePrice = totalSalePrice * (1 - body.discountValue / 100);
    } else {
      totalRentPrice = totalRentPrice - body.discountValue;
      totalSalePrice = totalSalePrice - body.discountValue;
    }
    
    const packageData = {
      ...body,
      totalRentPrice,
      totalSalePrice
    };
    
    const pkg = await Package.create(packageData);
    const populatedPackage = await Package.findById(pkg._id)
      .populate('items.productId');
    
    return NextResponse.json(populatedPackage, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { error: 'Failed to create package' },
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
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }
    
    const body = await req.json();
    
    // If items are being updated, recalculate prices
    if (body.items) {
      let totalRentPrice = 0;
      let totalSalePrice = 0;
      
      for (const item of body.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return NextResponse.json(
            { error: `Product ${item.productId} not found` },
            { status: 404 }
          );
        }
        
        totalRentPrice += product.rentPrice * item.quantity;
        totalSalePrice += product.salePrice * item.quantity;
      }
      
      // Apply discount
      if (body.discountType === 'percentage') {
        totalRentPrice = totalRentPrice * (1 - body.discountValue / 100);
        totalSalePrice = totalSalePrice * (1 - body.discountValue / 100);
      } else {
        totalRentPrice = totalRentPrice - body.discountValue;
        totalSalePrice = totalSalePrice - body.discountValue;
      }
      
      body.totalRentPrice = totalRentPrice;
      body.totalSalePrice = totalSalePrice;
    }
    
    const pkg = await Package.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate('items.productId');
    
    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(pkg);
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json(
      { error: 'Failed to update package' },
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
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }
    
    const pkg = await Package.findByIdAndDelete(id);
    
    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 }
    );
  }
} 