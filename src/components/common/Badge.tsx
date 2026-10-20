import React from 'react';
import { CheckCircle2, AlertCircle, Clock, XCircle, ShieldCheck } from 'lucide-react';
import { VerificationStatus, ProductStatus, QuotationStatus, OrderStatus } from '../../types';

export const VerificationBadge: React.FC<{ status: VerificationStatus }> = ({ status }) => {
  switch (status) {
    case 'verified':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>GSTIN Verified</span>
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Pending Verification</span>
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Rejected</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
          <span>Info Required</span>
        </span>
      );
  }
};

export const ProductStatusBadge: React.FC<{ status: ProductStatus }> = ({ status }) => {
  switch (status) {
    case 'published':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
          <CheckCircle2 className="w-3 h-3 text-teal-600" />
          <span>Published</span>
        </span>
      );
    case 'pending_approval':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
          <Clock className="w-3 h-3 text-amber-600" />
          <span>Pending Moderation</span>
        </span>
      );
    case 'draft':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
          <span>Draft</span>
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
          <XCircle className="w-3 h-3 text-rose-600" />
          <span>Rejected</span>
        </span>
      );
    case 'suspended':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded">
          <span>Suspended</span>
        </span>
      );
  }
};

export const QuotationStatusBadge: React.FC<{ status: QuotationStatus }> = ({ status }) => {
  switch (status) {
    case 'sent':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
          <Clock className="w-3 h-3 text-blue-600" />
          <span>Quote Sent</span>
        </span>
      );
    case 'under_negotiation':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
          <AlertCircle className="w-3 h-3 text-amber-600" />
          <span>Under Negotiation</span>
        </span>
      );
    case 'accepted':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Accepted · PO Created</span>
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
          <XCircle className="w-3 h-3 text-rose-600" />
          <span>Declined</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
          <span>{status}</span>
        </span>
      );
  }
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  switch (status) {
    case 'confirmed':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>PO Confirmed</span>
        </span>
      );
    case 'in_production':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
          <Clock className="w-3 h-3 text-indigo-600" />
          <span>In Production</span>
        </span>
      );
    case 'dispatched':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
          <span>Dispatched (Transit)</span>
        </span>
      );
    case 'delivered':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
          <span>Delivered</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
          <span>{status}</span>
        </span>
      );
  }
};
