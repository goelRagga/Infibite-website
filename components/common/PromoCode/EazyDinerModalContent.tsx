interface EazyDinerModalProps {}

const steps = [
  {
    title: 'Click Redeem',
    description:
      'Click on the redeem button to access the EazyDiner Prime Membership page.',
  },
  {
    title: 'Log In or Sign Up',
    description:
      'Log In using your registered mobile number and email. If you are new, sign up to create your account',
  },
  {
    title: 'Choose Your Plan',
    description: 'Choose a membership plan that matches your discount code.',
  },
  {
    title: 'Apply the Discount code',
    description: 'Click Use Coupons, enter the code, and apply it',
  },
  {
    title: 'Complete Payment',
    description: 'Click Proceed to finalize your free membership',
  },
  {
    title: 'Enjoy Benefits',
    description:
      'Your membership is activated instantly—start dining with discounts!',
  },
];

const EazyDinerModal: React.FC<EazyDinerModalProps> = () => {
  return (
    <div>
      {steps.map((step, index) => (
        <div className="flex items-center mt-5" key={index}>
          <div
            className="text-xs mr-4 font-semibold flex justify-center items-center w-[20px] h-[22px] p-3 rounded-3xl"
            style={{
              background: 'var(--orange5)',
              color: 'var(--orange2)',
            }}
          >
            {index + 1}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {step.title}
            </p>
            <p className="text-xs text-foreground">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EazyDinerModal;
