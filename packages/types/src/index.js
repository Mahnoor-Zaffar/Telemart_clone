"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FREE_SHIPPING_THRESHOLD = exports.COD_FEE = exports.PAKISTAN_CITIES = exports.VendorStatus = exports.PreOwnedGrade = exports.ProductCondition = exports.PtaStatus = exports.PaymentStatus = exports.PaymentMethod = exports.OrderStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["VENDOR"] = "VENDOR";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["RETURNED"] = "RETURNED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["COD"] = "COD";
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["JAZZCASH"] = "JAZZCASH";
    PaymentMethod["EASYPAISA"] = "EASYPAISA";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethod["BNPL"] = "BNPL";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PtaStatus;
(function (PtaStatus) {
    PtaStatus["APPROVED"] = "APPROVED";
    PtaStatus["NON_PTA"] = "NON_PTA";
    PtaStatus["NA"] = "NA";
})(PtaStatus || (exports.PtaStatus = PtaStatus = {}));
var ProductCondition;
(function (ProductCondition) {
    ProductCondition["NEW"] = "NEW";
    ProductCondition["PRE_OWNED"] = "PRE_OWNED";
    ProductCondition["REFURBISHED"] = "REFURBISHED";
})(ProductCondition || (exports.ProductCondition = ProductCondition = {}));
var PreOwnedGrade;
(function (PreOwnedGrade) {
    PreOwnedGrade["A"] = "A";
    PreOwnedGrade["B"] = "B";
    PreOwnedGrade["C"] = "C";
})(PreOwnedGrade || (exports.PreOwnedGrade = PreOwnedGrade = {}));
var VendorStatus;
(function (VendorStatus) {
    VendorStatus["PENDING"] = "PENDING";
    VendorStatus["APPROVED"] = "APPROVED";
    VendorStatus["REJECTED"] = "REJECTED";
    VendorStatus["SUSPENDED"] = "SUSPENDED";
})(VendorStatus || (exports.VendorStatus = VendorStatus = {}));
exports.PAKISTAN_CITIES = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Hyderabad',
    'Sialkot',
    'Gujranwala',
    'Abbottabad',
    'Sargodha',
    'Bahawalpur',
    'Sukkur',
];
exports.COD_FEE = 150;
exports.FREE_SHIPPING_THRESHOLD = 5000;
//# sourceMappingURL=index.js.map