import tkinter as tk
from tkinter import ttk, messagebox
import sqlite3
import datetime

class InventoryManagementSystem:
    def __init__(self, root):
        self.root = root
        self.root.title("入库单管理系统")
        self.root.geometry("1000x600")
        
        # 配置数据库
        self.db_path = "inventory.db"
        self.create_db()
        
        # 主框架
        self.main_frame = ttk.Frame(self.root)
        self.main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # 标题栏
        self.header_frame = ttk.Frame(self.main_frame)
        self.header_frame.pack(fill=tk.X, pady=(0, 20))
        
        ttk.Label(self.header_frame, text="入库单", font=("微软雅黑", 16, "bold")).pack(side=tk.LEFT)
        ttk.Label(self.header_frame, text="• 编辑中", font=("微软雅黑", 12, "bold"), foreground="#1890ff").pack(side=tk.LEFT, padx=10)
        
        # 操作按钮
        self.button_frame = ttk.Frame(self.header_frame)
        self.button_frame.pack(side=tk.RIGHT)
        
        self.add_button = ttk.Button(self.button_frame, text="新增", command=self.open_add_window, style="Accent.TButton")
        self.add_button.pack(side=tk.LEFT, padx=5)
        
        self.reset_button = ttk.Button(self.button_frame, text="重置", command=self.reset_search, style="Primary.TButton")
        self.reset_button.pack(side=tk.LEFT, padx=5)
        
        self.delete_button = ttk.Button(self.button_frame, text="删除", command=self.delete_inventory, style="Danger.TButton")
        self.delete_button.pack(side=tk.LEFT, padx=5)
        
        self.refresh_button = ttk.Button(self.button_frame, text="刷新", command=self.refresh_list, style="Info.TButton")
        self.refresh_button.pack(side=tk.LEFT, padx=5)
        
        # 查询框
        self.search_frame = ttk.Frame(self.main_frame)
        self.search_frame.pack(fill=tk.X, pady=(0, 20))
        
        ttk.Label(self.search_frame, text="商品编码:").pack(side=tk.LEFT, padx=10)
        self.search_var = tk.StringVar()
        ttk.Entry(self.search_frame, textvariable=self.search_var, width=30).pack(side=tk.LEFT, padx=10)
        ttk.Button(self.search_frame, text="查询", command=self.search_inventory, style="Primary.TButton").pack(side=tk.LEFT, padx=10)
        
        # 表格框架
        self.table_frame = ttk.Frame(self.main_frame)
        self.table_frame.pack(fill=tk.BOTH, expand=True)
        
        # 表格
        columns = ("id", "code", "quantity", "price", "amount", "status", "created_at", "updated_at", "action")
        self.tree = ttk.Treeview(self.table_frame, columns=columns, show="headings")
        
        # 设置列标题
        self.tree.heading("id", text="序号")
        self.tree.heading("code", text="商品编码")
        self.tree.heading("quantity", text="数量")
        self.tree.heading("price", text="单价")
        self.tree.heading("amount", text="金额")
        self.tree.heading("status", text="状态")
        self.tree.heading("created_at", text="创建时间")
        self.tree.heading("updated_at", text="更新时间")
        self.tree.heading("action", text="操作")
        
        # 设置列宽
        self.tree.column("id", width=50)
        self.tree.column("code", width=150)
        self.tree.column("quantity", width=80)
        self.tree.column("price", width=80)
        self.tree.column("amount", width=80)
        self.tree.column("status", width=80)
        self.tree.column("created_at", width=150)
        self.tree.column("updated_at", width=150)
        self.tree.column("action", width=100)
        
        # 添加滚动条
        scrollbar = ttk.Scrollbar(self.table_frame, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscroll=scrollbar.set)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.tree.pack(fill=tk.BOTH, expand=True)
        
        # 分页控件
        self.pagination_frame = ttk.Frame(self.main_frame)
        self.pagination_frame.pack(fill=tk.X, pady=10)
        
        self.total_label = ttk.Label(self.pagination_frame, text="共 0 条  10条/页")
        self.total_label.pack(side=tk.LEFT)
        
        self.page_info = ttk.Label(self.pagination_frame, text="第 1 页  共 1 页")
        self.page_info.pack(side=tk.LEFT, padx=20)
        
        self.prev_button = ttk.Button(self.pagination_frame, text="上一页", command=self.prev_page)
        self.prev_button.pack(side=tk.RIGHT, padx=5)
        
        self.next_button = ttk.Button(self.pagination_frame, text="下一页", command=self.next_page)
        self.next_button.pack(side=tk.RIGHT, padx=5)
        
        # 样式设置
        self.setup_styles()
        
        # 分页变量
        self.current_page = 1
        self.page_size = 10
        
        # 加载数据
        self.refresh_list()
    
    def setup_styles(self):
        # 创建样式
        style = ttk.Style()
        style.theme_use("clam")
        
        # 按钮样式
        style.configure("Accent.TButton", background="#52c41a", foreground="white")
        style.configure("Primary.TButton", background="#1890ff", foreground="white")
        style.configure("Danger.TButton", background="#ff4d4f", foreground="white")
        style.configure("Info.TButton", background="#13c2c2", foreground="white")
        
        # 表格样式
        style.configure("Treeview", rowheight=25, font=("微软雅黑", 10))
        style.configure("Treeview.Heading", font=("微软雅黑", 10, "bold"))
    
    def create_db(self):
        # 创建数据库表
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS inventory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                amount REAL NOT NULL,
                status TEXT DEFAULT '正常',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        ''')
        conn.commit()
        conn.close()
    
    def open_add_window(self, inventory_id=None):
        # 打开新增/编辑入库单窗口
        AddInventoryWindow(self.root, self, inventory_id)
    
    def search_inventory(self):
        # 查询入库单
        self.current_page = 1
        self.refresh_list()
    
    def reset_search(self):
        # 重置查询
        self.search_var.set("")
        self.current_page = 1
        self.refresh_list()
    
    def delete_inventory(self):
        # 删除入库单
        selected_item = self.tree.selection()
        if not selected_item:
            messagebox.showinfo("提示", "请选择要删除的入库单")
            return
        if messagebox.askyesno("确认", "确定要删除选中的入库单吗？"):
            item = selected_item[0]
            inventory_id = self.tree.item(item, "values")[0]
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("DELETE FROM inventory WHERE id=?", (inventory_id,))
            conn.commit()
            conn.close()
            self.refresh_list()
            messagebox.showinfo("提示", "删除成功")
    
    def refresh_list(self):
        # 刷新入库单列表
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        search_text = self.search_var.get().strip()
        
        # 获取总数
        if search_text:
            cursor.execute("SELECT COUNT(*) FROM inventory WHERE code LIKE ?", (f"%{search_text}%",))
        else:
            cursor.execute("SELECT COUNT(*) FROM inventory")
        total = cursor.fetchone()[0]
        
        # 更新总数标签
        self.total_label.config(text=f"共 {total} 条  10条/页")
        
        # 计算分页
        total_pages = (total + self.page_size - 1) // self.page_size
        self.page_info.config(text=f"第 {self.current_page} 页  共 {total_pages} 页")
        
        # 获取当前页数据
        offset = (self.current_page - 1) * self.page_size
        if search_text:
            cursor.execute("SELECT * FROM inventory WHERE code LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?", 
                         (f"%{search_text}%", self.page_size, offset))
        else:
            cursor.execute("SELECT * FROM inventory ORDER BY id DESC LIMIT ? OFFSET ?", (self.page_size, offset))
        inventories = cursor.fetchall()
        
        for i, inventory in enumerate(inventories, start=offset+1):
            # 创建操作按钮
            action_frame = ttk.Frame()
            edit_button = ttk.Button(action_frame, text="编辑", command=lambda sid=inventory[0]: self.open_add_window(sid), style="Primary.TButton")
            edit_button.pack(side=tk.LEFT, padx=2)
            delete_button = ttk.Button(action_frame, text="删除", command=lambda sid=inventory[0]: self.delete_inventory_by_id(sid), style="Danger.TButton")
            delete_button.pack(side=tk.LEFT, padx=2)
            
            self.tree.insert("", tk.END, values=(
                inventory[0],
                inventory[1],
                inventory[2],
                inventory[3],
                inventory[4],
                inventory[5],
                inventory[6],
                inventory[7],
                action_frame
            ))
        
        conn.close()
    
    def delete_inventory_by_id(self, inventory_id):
        # 根据ID删除入库单
        if messagebox.askyesno("确认", "确定要删除该入库单吗？"):
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("DELETE FROM inventory WHERE id=?", (inventory_id,))
            conn.commit()
            conn.close()
            self.refresh_list()
            messagebox.showinfo("提示", "删除成功")
    
    def prev_page(self):
        # 上一页
        if self.current_page > 1:
            self.current_page -= 1
            self.refresh_list()
    
    def next_page(self):
        # 下一页
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        search_text = self.search_var.get().strip()
        if search_text:
            cursor.execute("SELECT COUNT(*) FROM inventory WHERE code LIKE ?", (f"%{search_text}%",))
        else:
            cursor.execute("SELECT COUNT(*) FROM inventory")
        total = cursor.fetchone()[0]
        conn.close()
        
        total_pages = (total + self.page_size - 1) // self.page_size
        if self.current_page < total_pages:
            self.current_page += 1
            self.refresh_list()

class AddInventoryWindow:
    def __init__(self, parent, main_app, inventory_id=None):
        self.parent = parent
        self.main_app = main_app
        self.inventory_id = inventory_id
        
        self.window = tk.Toplevel(parent)
        self.window.title("新增" if inventory_id is None else "编辑")
        self.window.geometry("500x400")
        self.window.transient(parent)
        self.window.grab_set()
        
        # 表单框架
        self.form_frame = ttk.Frame(self.window, padding=30)
        self.form_frame.pack(fill=tk.BOTH, expand=True)
        
        # 商品编码
        ttk.Label(self.form_frame, text="*商品编码").grid(row=0, column=0, sticky=tk.W, pady=15)
        self.code_var = tk.StringVar()
        ttk.Entry(self.form_frame, textvariable=self.code_var, width=40).grid(row=0, column=1, pady=15)
        
        # 数量
        ttk.Label(self.form_frame, text="*数量").grid(row=1, column=0, sticky=tk.W, pady=15)
        self.quantity_var = tk.StringVar()
        ttk.Entry(self.form_frame, textvariable=self.quantity_var, width=40).grid(row=1, column=1, pady=15)
        
        # 单价
        ttk.Label(self.form_frame, text="*单价").grid(row=2, column=0, sticky=tk.W, pady=15)
        self.price_var = tk.StringVar()
        ttk.Entry(self.form_frame, textvariable=self.price_var, width=40).grid(row=2, column=1, pady=15)
        
        # 按钮框架
        self.button_frame = ttk.Frame(self.window, padding=30)
        self.button_frame.pack(fill=tk.X)
        
        ttk.Button(self.button_frame, text="取消", command=self.window.destroy).pack(side=tk.RIGHT, padx=10)
        ttk.Button(self.button_frame, text="确认", command=self.save_inventory, style="Accent.TButton").pack(side=tk.RIGHT, padx=10)
        
        # 如果是编辑模式，加载数据
        if inventory_id:
            self.load_inventory_data()
    
    def load_inventory_data(self):
        # 加载入库单数据
        conn = sqlite3.connect(self.main_app.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM inventory WHERE id=?", (self.inventory_id,))
        inventory = cursor.fetchone()
        conn.close()
        
        if inventory:
            self.code_var.set(inventory[1])
            self.quantity_var.set(str(inventory[2]))
            self.price_var.set(str(inventory[3]))
    
    def save_inventory(self):
        # 保存入库单信息
        code = self.code_var.get().strip()
        quantity = self.quantity_var.get().strip()
        price = self.price_var.get().strip()
        
        if not code or not quantity or not price:
            messagebox.showinfo("提示", "带*的字段不能为空")
            return
        
        try:
            quantity = int(quantity)
            price = float(price)
            amount = quantity * price
        except ValueError:
            messagebox.showinfo("提示", "数量和单价必须是数字")
            return
        
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        conn = sqlite3.connect(self.main_app.db_path)
        cursor = conn.cursor()
        
        if self.inventory_id:
            # 更新
            cursor.execute('''
                UPDATE inventory SET code=?, quantity=?, price=?, amount=?, updated_at=?
                WHERE id=?
            ''', (code, quantity, price, amount, now, self.inventory_id))
        else:
            # 新增
            cursor.execute('''
                INSERT INTO inventory (code, quantity, price, amount, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (code, quantity, price, amount, now, now))
        
        conn.commit()
        conn.close()
        
        self.main_app.refresh_list()
        self.window.destroy()
        messagebox.showinfo("提示", "保存成功")

if __name__ == "__main__":
    root = tk.Tk()
    app = InventoryManagementSystem(root)
    root.mainloop()