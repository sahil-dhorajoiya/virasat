import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/order';
import Product from '@/lib/models/product';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    const orderType = searchParams.get('orderType');
    
    let query: any = {};
    
    if (customerId) query.customerId = customerId;
    if (status) query.status = status;
    if (orderType) query.orderType = orderType;
    
    const orders = await Order.find(query)
      .populate('customerId')
      .populate('items.productId');
      
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Update product stock
    for (const item of body.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }
      
      if (product.availableStock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product ${product.name}` },
          { status: 400 }
        );
      }
      
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { availableStock: -item.quantity }
      });
    }
    
    const order = await Order.create(body);
    const populatedOrder = await Order.findById(order._id)
      .populate('customerId')
      .populate('items.productId');
    
    return NextResponse.json(populatedOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
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
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    const body = await req.json();
    const oldOrder = await Order.findById(id);
    
    if (!oldOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // If status is changing to 'cancelled', return items to stock
    if (body.status === 'cancelled' && oldOrder.status !== 'cancelled') {
      for (const item of oldOrder.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { availableStock: item.quantity }
        });
      }
    }
    
    const order = await Order.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate('customerId').populate('items.productId');
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
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
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Return items to stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { availableStock: item.quantity }
      });
    }
    
    await Order.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
} 