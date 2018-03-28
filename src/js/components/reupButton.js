import React, { Component } from 'react'
import { Button, Label } from 'semantic-ui-react'

class ReupButton extends Component {
    render () {
        return (
            <div>
                <Button>Reup</Button>
                <Label className='tag'>$$$$$</Label>
            </div>
        )
    }
}

export default ReupButton;