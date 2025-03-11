import React from 'react'

export default function Delivaryinstruction() {
  return (
    <>
<div className="mt-5">
                <label for="DeliveryInstructions" className="form-label sr-only">
                  Delivery instructions
                </label>
                <textarea
                  className="form-control"
                  id="DeliveryInstructions"
                  rows="3"
                  placeholder="Write delivery instructions "
                ></textarea>
                <p className="form-text">
                  Add instructions for how you want your order shopped and/or
                  delivered
                </p>
            
              </div>
    </>
  )
}
