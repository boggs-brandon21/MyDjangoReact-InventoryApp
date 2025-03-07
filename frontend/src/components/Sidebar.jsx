import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/js/dist/dropdown';
import '../styles/Sidebar.css';

function SidebarMenu() {
	return (
		<div className="container-fluid">
			<div className="row">
				<div className="bg-dark col-auto col-md-2 min-vh-100 d-flex justify-content-between flex-column">
					<div>
						<a className="text-decoration-none text-white d-none d-sm-inline d-flex align-itemcenter ms-3 mt-2">
							<i className="fs-4 bi bi-speedometer"></i>
							<span className="ms-1 fs-4 d-none d-sm-inline">
								Brand
							</span>
						</a>
						<hr className="text-secondary d-none d-sm-block" />
						<ul className="nav nav-pills flex-column mt-3 mt-sm-0">
							<li className="nav-item text-white fs-4 my-1 py-2 py-sm-0">
								<a
									href="#"
									className="nav-link text-white fs-5"
									aria-current="page"
								>
									<i className="bi bi-house"></i>
									<span className="ms-3 d-none d-sm-inline">
										Home
									</span>
								</a>
							</li>
							<li className="nav-item text-white fs-4 my-1 py-2 py-sm-0">
								<a
									href="#"
									className="nav-link text-white fs-5"
									aria-current="page"
								>
									<i className="bi bi-table"></i>
									<span className="ms-3 d-none d-sm-inline">
										Orders
									</span>
								</a>
							</li>
							<li className="nav-item text-white fs-4 my-1 py-2 py-sm-0">
								<a
									href="#"
									className="nav-link text-white fs-5"
									aria-current="page"
								>
									<i className="bi bi-grid"></i>
									<span className="ms-3 d-none d-sm-inline">
										Products
									</span>
								</a>
							</li>
							<li className="nav-item text-white fs-4 my-1 py-2 py-sm-0">
								<a
									href="#"
									className="nav-link text-white fs-5"
									aria-current="page"
								>
									<i className="bi bi-people"></i>
									<span className="ms-3 d-none d-sm-inline">
										Customers
									</span>
								</a>
							</li>
						</ul>
						<div className="dropdown open">
							<a
								className="text-decoration-none text-white dropdown-toggle p-3"
								type="button"
								id="triggerId"
								data-bs-toggle="dropdown"
								aria-haspopup="true"
							>
								<i className="bi bi-person-circle"></i>
								<span className="ms-3 d-none d-sm-inline">
									Brandon
								</span>
							</a>
							<div
								className="dropdown-menu"
								aria-labelledby="triggerId"
							>
								<a className="dropdown-item" href="#">
									Profile
								</a>
								<a className="dropdown-item" href="#">
									Settings
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SidebarMenu;
