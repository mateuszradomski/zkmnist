fn main(x: Field) {
    assert(x + x == 4);
}

#[test]
fn test_main() {
    main(2);
    // Uncomment to make test fail
    // main(1, 1);
}
