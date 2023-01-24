import React, { Component } from 'react'

class Footer extends Component {
    
    render(){
        return(
            <footer className="footer">
                <div className='footerContactUs'>
                    <p><b>Contact us</b></p>
                </div>
                <div className='realFooter'>
                    
                    <ul>
                        <li><a href="mailto:18wh1a0532@bvrithyderabad.edu.in">Email</a></li>
                        <li><a href="https://github.com/Ashritha-Nalla">Github</a></li>
                        <li>
                            <p>👋</p>
                        </li>
                    </ul>
                </div>
            </footer>
            )
        }
    }
    
    export default Footer;
