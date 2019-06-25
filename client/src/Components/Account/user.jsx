        <div className="Account">
            <h2>User Account Information</h2>
            <div className="current-account">
                <h4>Current Account Settings</h4>
                <div>
                    <p>Nickname: {this.props.user.nickname}</p>
                </div>
                <div>
                    <p>Age: {this.props.user.age}</p>
                </div>
                <div>
                    <p>Gender: {this.props.user.gender}</p>
                </div>
                <div>
                    <p>Email: {this.props.user.email}</p>
                </div>
                <div>
                    <p>Phone Number: {this.props.user.phoneNumber}</p>
                </div>
            </div>
            <div className="account-form">
                <h4>Change User Account Information</h4>
                <Form
                    nickname
                    age
                    gender
                    email
                    phoneNumber
                    password
                    passwordConfirm
                    button={"Update"}
                    onSubmit={this.handleOnSubmit}
                    onChange={this.handleOnChange}
                />
                {this.renderAlert()}
            </div>
            <div className="change-your-password-here">
                <p>
                    Change your password{" "}
                    <Link to="/changepassword">here</Link>.
                </p>
            </div>
        </div>